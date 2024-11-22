from flask import Flask, request, jsonify
import joblib
import pandas as pd


# Load model and vectorizer
model = joblib.load("refund_model.pkl")
vectorizer = joblib.load("refund_vectorizer.pkl")

app = Flask(__name__)

@app.route("/evaluate-refund", methods=["POST"])
def evaluate_refund():
    data = request.json
    reason = data["reason"]
    order_amount = data["order_amount"]
    previous_refunds = data["previous_refunds"]

    # Transform inputs
    reason_vectorized = vectorizer.transform([reason])
    numeric_features = [[order_amount, previous_refunds]]
    features = pd.concat(
    [pd.DataFrame(reason_vectorized.toarray()), pd.DataFrame(numeric_features)],
    axis=1
)


    # Predict
    prediction = model.predict(features)
    return jsonify({"approved": bool(prediction[0])})

if __name__ == "__main__":
    app.run(port=5000)
