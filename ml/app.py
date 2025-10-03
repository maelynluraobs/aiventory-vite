# app.py
from flask import Flask, jsonify, request
import pandas as pd
from ml_service import predict_sales

app = Flask(__name__)

# Example dataset (replace with DB later)
data = pd.DataFrame({
    "date": pd.date_range("2024-01-01", periods=100, freq="D"),
    "product_id": ["spark-plug"] * 100,
    "units_sold": [5,4,6,7,5,6,8,7,6,5]*10
})

@app.route("/predict/<product_id>", methods=["GET"])
def predict(product_id):
    days = int(request.args.get("days", 14))
    result = predict_sales(data, product_id, forecast_days=days)
    return jsonify(result)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
