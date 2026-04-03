

from flask import Flask, request, jsonify
from flask_cors import CORS
import os, io, base64, traceback, json

import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image

app = Flask(__name__)
CORS(app, origins=["*"])

# ── CLASS NAMES ────────────────────────────────────────────────────────────────
# Standard PlantVillage tomato dataset — 10 classes alphabetical order
CLASS_NAMES = [
    "bacterial_spot",
    "early_blight",
    "healthy",
    "late_blight",
    "leaf_mold",
    "cercospora_leaf_mold",
    "spider_mites",
    "insect_damage",
    "leaf_curl_virus",
    "leaf_miner",
]

import gdown

MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "models", "tomato_resnet18.pth")

# Auto-download model if not present
if not os.path.exists(MODEL_PATH):
    os.makedirs("models", exist_ok=True)
    print("Downloading model from Google Drive...")
    gdown.download(
        "https://drive.google.com/uc?id=1k64jh39dntpDcvNFG01gsmUu1xfYb2pZ",
        MODEL_PATH,
        quiet=False
    )
    print("Model downloaded!")

# MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "models", "tomato_resnet18.pth")

TRANSFORM = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225]),
])

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model  = None
model_loaded = False

def load_model():
    global model, model_loaded
    try:
        print(f"\n  Loading: {MODEL_PATH}")
        if not os.path.exists(MODEL_PATH):
            print(f"  ERROR: File not found -> {MODEL_PATH}")
            return False

        checkpoint = torch.load(MODEL_PATH, map_location=device)

        num_classes = len(CLASS_NAMES)

        if isinstance(checkpoint, dict) and "fc.weight" in checkpoint:
            num_classes = checkpoint["fc.weight"].shape[0]
            net = models.resnet18(weights=None)
            net.fc = nn.Linear(net.fc.in_features, num_classes)
            net.load_state_dict(checkpoint, strict=True)

        elif isinstance(checkpoint, dict) and "state_dict" in checkpoint:
            sd = checkpoint["state_dict"]
            num_classes = sd["fc.weight"].shape[0]
            net = models.resnet18(weights=None)
            net.fc = nn.Linear(net.fc.in_features, num_classes)
            net.load_state_dict({k.replace("module.", ""): v for k, v in sd.items()}, strict=False)

        elif isinstance(checkpoint, dict) and "model_state_dict" in checkpoint:
            sd = checkpoint["model_state_dict"]
            num_classes = sd["fc.weight"].shape[0]
            net = models.resnet18(weights=None)
            net.fc = nn.Linear(net.fc.in_features, num_classes)
            net.load_state_dict({k.replace("module.", ""): v for k, v in sd.items()}, strict=False)

        else:
            # Entire model saved with torch.save(model, path)
            net = checkpoint

        net.eval()
        model = net.to(device)
        model_loaded = True
        print(f"  Model loaded OK — device={device}")
        return True

    except Exception as e:
        print(f"  FAILED to load model: {e}")
        traceback.print_exc()
        return False

load_model()


def predict(pil_img: Image.Image):
    tensor = TRANSFORM(pil_img).unsqueeze(0).to(device)
    with torch.no_grad():
        probs = torch.softmax(model(tensor), dim=1)[0]

    k = min(5, probs.shape[0])
    top_probs, top_idxs = torch.topk(probs, k)

    cls = CLASS_NAMES[:probs.shape[0]]
    while len(cls) < probs.shape[0]:
        cls.append(f"class_{len(cls)}")

    all_preds = [
        {
            "class": cls[top_idxs[i].item()],
            "probability": round(top_probs[i].item(), 4),
            "confidence_percent": round(top_probs[i].item() * 100, 1),
        }
        for i in range(k)
    ]

    return {
        "prediction":      cls[top_idxs[0].item()],
        "probability":     round(top_probs[0].item(), 4),
        "all_predictions": all_preds,
    }


@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "model_loaded": model_loaded,
        "device": str(device),
        "classes": CLASS_NAMES,
    })


@app.route("/analyze", methods=["POST"])
def analyze():
    if not model_loaded:
        return jsonify({"error": "Model not loaded. Check terminal for errors."}), 503
    try:
        data = request.get_json(force=True) or {}
        img_b64 = data.get("imageBase64")
        if not img_b64:
            return jsonify({"error": "No imageBase64 field in request."}), 400

        pil_img = Image.open(io.BytesIO(base64.b64decode(img_b64))).convert("RGB")
        result  = predict(pil_img)

        return jsonify({
            "content": [{"type": "text", "text": json.dumps(result)}],
            "usage":   {"input_tokens": 0, "output_tokens": 0},
        })
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.route("/chat", methods=["POST"])
def chat():
    return jsonify({"content": [{"type": "text", "text": "Local model mode."}]})


if __name__ == "__main__":
    print("\n" + "="*60)
    print("  AgroAI — Local ResNet-18 Server")
    print("="*60)
    print(f"  Model : {MODEL_PATH}")
    print(f"  Device: {device}")
    print(f"  Status: {'LOADED OK' if model_loaded else 'FAILED — check path/format'}")
    print("="*60 + "\n")
    app.run(host="0.0.0.0", port=5000, debug=False)