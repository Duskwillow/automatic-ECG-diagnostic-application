from flask import Flask, jsonify, request
from flask_cors import CORS
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

# Load the traied model
try:
    model = load_model("model.hdf5")
    print("model loaded successfully")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

ECG_CONDITIONS = ["1dAVb", "RBBB", "LBBB", "SB", "AF", "ST"]


@app.route("/api/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        # print('data',data)
        # print('request data',data)
        ecg_data = data.get("ecg_data", [])
        # print('ecg_data',ecg_data)
        # print('ecg data',ecg_data)
        if not ecg_data:
            print("No ECG data povided")
            return jsonify({"error": "No ECG data povided"}), 400

        ecg_array = np.array(ecg_data, dtype=np.float32)

        if ecg_array.shape != (4096, 12):
            print(f"Expected ECG data shape (4096, 12), got {ecg_array.shape}")
            return jsonify(
                {"error": f"Expected ECG data shape (4096, 12), got {ecg_array.shape}"}
            ), 400

        ecg_input = np.expand_dims(ecg_array, axis=0)
        if model:
            predictions = model.predict(ecg_input)
            df_preds = pd.DataFrame(predictions, columns=ECG_CONDITIONS)

            result = df_preds.to_dict("records")
            print("result", result)
            return jsonify(
                {
                    "predictions": result,
                    "message": "Analysis complete using trained model",
                }
            )

    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/model-info", methods=["GET"])
def model_info():
    """Endpoint to check model status and input requirements"""
    if model:
        return jsonify(
            {
                "status": "loaded",
                "input_shape": "(1, 4096, 12)",
                "output_conditions": ECG_CONDITIONS,
                "model_summary": "Trained ECG classification model",
            }
        )
    else:
        return jsonify(
            {"status": "not_loaded", "message": "Model failed to load, using mock data"}
        )


if __name__ == "__main__":
    app.run(debug=True, port=5000, host="0.0.0.0")
