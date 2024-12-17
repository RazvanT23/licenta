from flask import Flask, request, jsonify
import joblib
import pandas as pd

# Load the trained model
model = joblib.load("refund_model.pkl")

app = Flask(__name__)

@app.route("/evaluate-refund", methods=["POST"])
def evaluate_refund():
    # Parse the incoming JSON request
    data = request.json
    reason = data.get("reason", "")

    # Prepare the input for prediction
    input_data = pd.Series([reason])

    # Make a prediction
    prediction = model.predict(input_data)
    approved = bool(int(prediction[0]))

    # Return the response as JSON
    return jsonify({"approved": approved})

if __name__ == "__main__":
    app.run(port=5000)
