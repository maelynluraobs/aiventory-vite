# ml_service.py
import pandas as pd
import numpy as np
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.stattools import adfuller
from datetime import timedelta
import warnings
warnings.filterwarnings("ignore")

# ---------- Data Prep ----------
def prepare_timeseries(df, product_id, date_col="date", units_col="units_sold", freq="D"):
    prod = df[df["product_id"] == product_id].copy()
    prod = prod[[date_col, units_col]].set_index(date_col).sort_index()

    # Reindex to daily intervals
    full_idx = pd.date_range(prod.index.min(), prod.index.max(), freq=freq)
    prod = prod.reindex(full_idx)

    # Fill missing values (assume 0 sales if missing)
    prod[units_col] = prod[units_col].fillna(0)
    prod.index.name = "date"
    prod = prod.rename(columns={units_col: "y"})
    return prod

def check_stationarity(ts):
    adf = adfuller(ts.dropna())
    return adf[1] < 0.05  # True if stationary

# ---------- ARIMA ----------
def train_arima(ts, order=(1,1,1)):
    model = ARIMA(ts, order=order)
    return model.fit()

def forecast_arima(fitted, steps=14):
    return fitted.get_forecast(steps=steps).predicted_mean

# ---------- Full Pipeline ----------
def predict_sales(df, product_id, forecast_days=14):
    ts = prepare_timeseries(df, product_id)
    stationary = check_stationarity(ts["y"])
    order = (1,0,1) if stationary else (1,1,1)

    train = ts["y"].iloc[:-forecast_days]
    test = ts["y"].iloc[-forecast_days:]

    fitted = train_arima(train, order)
    forecast = forecast_arima(fitted, steps=forecast_days)

    # Evaluation
    mse = ((forecast - test) ** 2).mean()
    mae = (forecast - test).abs().mean()
    mape = ((forecast - test).abs() / (test.replace(0, np.nan))).mean() * 100

    return {
        "product_id": product_id,
        "order": order,
        "metrics": {"mse": mse, "mae": mae, "mape": mape},
        "forecast": forecast.tolist()
    }
