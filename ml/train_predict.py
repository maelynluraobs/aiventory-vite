import pandas as pd
import mysql.connector
from statsmodels.tsa.arima.model import ARIMA
import sys

# Get product_id from command line argument or default to 1
product_id = int(sys.argv[1]) if len(sys.argv) > 1 else 1

# Connect to MySQL (XAMPP)
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="aiventory"
)

# Query stock movements
query = f"""
SELECT DATE(sm_date) AS record_date,
       SUM(CASE WHEN stock_movement_type='in' 
                THEN stock_movement_quantity 
                ELSE -stock_movement_quantity END) AS net_change
FROM stock_movement
JOIN inventory i ON stock_movement.inventory_id = i.inventory_id
WHERE i.product_id = {product_id}
GROUP BY DATE(sm_date)
ORDER BY record_date
"""
df = pd.read_sql(query, db)

if df.empty:
    print("No stock movement data found")
    sys.exit(0)

# Build cumulative stock level
df['stock_level'] = df['net_change'].cumsum()
df.set_index("record_date", inplace=True)

# Train ARIMA
model = ARIMA(df['stock_level'], order=(2,1,2))  # (p,d,q)
model_fit = model.fit()

# Forecast next 7 days
forecast = model_fit.forecast(steps=7)
print(forecast.tolist())  # return as list for Node.js