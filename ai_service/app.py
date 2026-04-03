# In ai_service/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from gtts import gTTS
import base64
from io import BytesIO

# Initialize Flask App
app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

# --- LOAD MODELS AND DATA (do this once on startup) ---
MODEL_PATH = "./intent_model"
LABEL_MAPPING_PATH = "./data/label_mapping.csv"
RESPONSES_PATH = "./data/responses.csv"

# Load tokenizer and model
try:
    tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
    model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH)
    model.eval()  # Set model to evaluation mode
    print("✅ Model and Tokenizer loaded successfully.")
except Exception as e:
    print(f"❌ Error loading model: {e}")

# Load label mapping and responses
try:
    label_mapping_df = pd.read_csv(LABEL_MAPPING_PATH)
    response_df = pd.read_csv(RESPONSES_PATH)
    # Create a dictionary for faster lookups
    response_dict = dict(zip(response_df['label_name'], response_df['response']))
    print("✅ Label mappings and responses loaded.")
except Exception as e:
    print(f"❌ Error loading CSV files: {e}")

# --- HELPER FUNCTIONS (from your notebook) ---
def predict_intent(text):
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=128)
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        predicted_class_id = torch.argmax(logits, dim=1).item()
    return predicted_class_id

def get_label_name(class_id):
    # The 'label' column in your CSV corresponds to the predicted_class_id
    label_name = label_mapping_df[label_mapping_df["label"] == class_id]["label_name"].values[0]
    return label_name

# --- API ENDPOINT ---
@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    if not data or "text" not in data:
        return jsonify({"error": "No text provided"}), 400

    text_input = data["text"]

    # 1. Predict Intent
    predicted_class_id = predict_intent(text_input)
    label_name = get_label_name(predicted_class_id)

    # 2. Get Response
    user_response_text = response_dict.get(label_name, "Sorry, I couldn't find an appropriate response.")

    # 3. Generate Audio (Text-to-Speech)
    try:
        tts = gTTS(text=user_response_text, lang='en', slow=False)
        mp3_fp = BytesIO()
        tts.write_to_fp(mp3_fp)
        mp3_fp.seek(0)
        # Encode the audio to base64 to send in JSON
        audio_base64 = base64.b64encode(mp3_fp.read()).decode('utf-8')
    except Exception as e:
        print(f"❌ Error generating TTS: {e}")
        audio_base64 = None


    # 4. Return everything in a JSON response
    return jsonify({
        "inputText": text_input,
        "predictedIntent": label_name,
        "responseText": user_response_text,
        "audioBase64": audio_base64
    })

if __name__ == "__main__":
    # Use a port that doesn't conflict with your React app (default 5173) or Node app (e.g., 8000)
    app.run(port=5000, debug=True)