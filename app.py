# import io
# import base64
# from pathlib import Path

# from flask import Flask, render_template, request
# from PIL import Image
# import torch
# import torch.nn.functional as F
# from torchvision import models, transforms


# BASE_DIR = Path(__file__).resolve().parent
# MODELS_DIR = BASE_DIR / "models"
# MODEL_PATH = MODELS_DIR / "tomato_resnet18.pth"


# def create_app():
#     app = Flask(__name__)

#     if not MODEL_PATH.exists():
#         raise RuntimeError(
#             f"Model file not found at {MODEL_PATH}. "
#             "Run train_model.py first to train and save the model."
#         )

#     checkpoint = torch.load(MODEL_PATH, map_location="cpu")
#     class_names = checkpoint["class_names"]
#     img_size = checkpoint.get("img_size", 224)

#     model = models.resnet18(weights=None)
#     in_features = model.fc.in_features
#     model.fc = torch.nn.Linear(in_features, len(class_names))
#     model.load_state_dict(checkpoint["model_state_dict"], strict=True)
#     model.eval()

#     preprocess = transforms.Compose(
#         [
#             transforms.Resize((img_size, img_size)),
#             transforms.ToTensor(),
#             transforms.Normalize(
#                 mean=[0.485, 0.456, 0.406],
#                 std=[0.229, 0.224, 0.225],
#             ),
#         ]
#     )

#     @app.route("/", methods=["GET", "POST"])
#     def index():
#         prediction = None
#         probability = None
#         uploaded_image_url = None
#         error = None

#         if request.method == "POST":
#             file = request.files.get("image")
#             if not file or file.filename == "":
#                 error = "Please select an image file."
#             else:
#                 try:
#                     image_bytes = file.read()
#                     mime_type = file.mimetype or "image/jpeg"
#                     encoded = base64.b64encode(image_bytes).decode("utf-8")
#                     uploaded_image_url = f"data:{mime_type};base64,{encoded}"
#                     image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
#                     input_tensor = preprocess(image).unsqueeze(0)

#                     with torch.no_grad():
#                         outputs = model(input_tensor)
#                         probs = F.softmax(outputs, dim=1)
#                         top_prob, top_idx = torch.max(probs, dim=1)

#                     prediction = class_names[top_idx.item()]
#                     probability = float(top_prob.item())
#                 except Exception as exc:  # noqa: BLE001
#                     error = f"Failed to process image: {exc}"

#         return render_template(
#             "index.html",
#             prediction=prediction,
#             probability=probability,
#             uploaded_image_url=uploaded_image_url,
#             error=error,
#         )

#     return app


# if __name__ == "__main__":
#     app = create_app()
#     app.run(debug=True)

# import io
# import base64
# from pathlib import Path

# import numpy as np
# from flask import Flask, render_template, request
# from PIL import Image
# import torch
# import torch.nn.functional as F
# from torchvision import models, transforms


# BASE_DIR = Path(__file__).resolve().parent
# MODELS_DIR = BASE_DIR / "models"
# MODEL_PATH = MODELS_DIR / "tomato_resnet18.pth"


# # Validation thresholds
# # You can tune these later if your camera/lighting conditions are different.
# DARK_MEAN_THRESHOLD = 50.0
# DARK_P90_THRESHOLD = 95.0
# DARK_RATIO_THRESHOLD = 0.75
# BLUR_LAPLACIAN_VARIANCE_THRESHOLD = 80.0


# def is_too_dark(image: Image.Image) -> bool:
#     gray = np.asarray(image.convert("L"), dtype=np.float32)
#     mean_brightness = float(gray.mean())
#     p90_brightness = float(np.percentile(gray, 90))
#     dark_ratio = float(np.mean(gray < 40))

#     return (
#         (mean_brightness < DARK_MEAN_THRESHOLD and p90_brightness < DARK_P90_THRESHOLD)
#         or dark_ratio > DARK_RATIO_THRESHOLD
#     )


# def is_too_blurry(image: Image.Image) -> bool:
#     gray = np.asarray(image.convert("L"), dtype=np.float32)

#     # Simple Laplacian-based sharpness check using only NumPy
#     padded = np.pad(gray, ((1, 1), (1, 1)), mode="edge")
#     laplacian = (
#         -4 * padded[1:-1, 1:-1]
#         + padded[:-2, 1:-1]
#         + padded[2:, 1:-1]
#         + padded[1:-1, :-2]
#         + padded[1:-1, 2:]
#     )

#     sharpness = float(laplacian.var())
#     return sharpness < BLUR_LAPLACIAN_VARIANCE_THRESHOLD


# def validate_image(image: Image.Image) -> str | None:
#     if is_too_dark(image):
#         return "Image is too dark. Please retake the photo in better lighting."
#     if is_too_blurry(image):
#         return "Image is too blurry. Please retake the photo with better focus."
#     return None


# def create_app():
#     app = Flask(__name__)

#     if not MODEL_PATH.exists():
#         raise RuntimeError(
#             f"Model file not found at {MODEL_PATH}. "
#             "Run train_model.py first to train and save the model."
#         )

#     checkpoint = torch.load(MODEL_PATH, map_location="cpu")
#     class_names = checkpoint["class_names"]
#     img_size = checkpoint.get("img_size", 224)

#     model = models.resnet18(weights=None)
#     in_features = model.fc.in_features
#     model.fc = torch.nn.Linear(in_features, len(class_names))
#     model.load_state_dict(checkpoint["model_state_dict"], strict=True)
#     model.eval()

#     preprocess = transforms.Compose(
#         [
#             transforms.Resize((img_size, img_size)),
#             transforms.ToTensor(),
#             transforms.Normalize(
#                 mean=[0.485, 0.456, 0.406],
#                 std=[0.229, 0.224, 0.225],
#             ),
#         ]
#     )

#     @app.route("/", methods=["GET", "POST"])
#     def index():
#         prediction = None
#         probability = None
#         uploaded_image_url = None
#         error = None

#         if request.method == "POST":
#             file = request.files.get("image")
#             if not file or file.filename == "":
#                 error = "Please select an image file."
#             else:
#                 try:
#                     image_bytes = file.read()
#                     mime_type = file.mimetype or "image/jpeg"
#                     encoded = base64.b64encode(image_bytes).decode("utf-8")
#                     uploaded_image_url = f"data:{mime_type};base64,{encoded}"

#                     image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

#                     # Validation happens before prediction.
#                     validation_error = validate_image(image)
#                     if validation_error:
#                         error = validation_error
#                     else:
#                         input_tensor = preprocess(image).unsqueeze(0)

#                         with torch.no_grad():
#                             outputs = model(input_tensor)
#                             probs = F.softmax(outputs, dim=1)
#                             top_prob, top_idx = torch.max(probs, dim=1)

#                         prediction = class_names[top_idx.item()]
#                         probability = float(top_prob.item())

#                 except Exception as exc:  # noqa: BLE001
#                     error = f"Failed to process image: {exc}"

#         return render_template(
#             "index.html",
#             prediction=prediction,
#             probability=probability,
#             uploaded_image_url=uploaded_image_url,
#             error=error,
#         )

#     return app


# if __name__ == "__main__":
#     app = create_app()
#     app.run(debug=True)


import io
import base64
from pathlib import Path

import numpy as np
from flask import Flask, request, jsonify, send_from_directory
from PIL import Image
import torch
import torch.nn.functional as F
from torchvision import models, transforms


BASE_DIR = Path(__file__).resolve().parent
MODELS_DIR = BASE_DIR / "models"
MODEL_PATH = MODELS_DIR / "tomato_resnet18.pth"


# Validation thresholds
DARK_MEAN_THRESHOLD = 60.0
DARK_P90_THRESHOLD = 95.0
DARK_RATIO_THRESHOLD = 0.75
BLUR_LAPLACIAN_VARIANCE_THRESHOLD = 100.0


def is_too_dark(image: Image.Image) -> bool:
    gray = np.asarray(image.convert("L"), dtype=np.float32)
    mean_brightness = float(gray.mean())
    p90_brightness = float(np.percentile(gray, 90))
    dark_ratio = float(np.mean(gray < 40))

    # return (
    #     (mean_brightness < DARK_MEAN_THRESHOLD and p90_brightness < DARK_P90_THRESHOLD)
    #     or dark_ratio > DARK_RATIO_THRESHOLD
    # )
    return (
        mean_brightness < DARK_MEAN_THRESHOLD          # catches uniformly dim images
        or (mean_brightness < DARK_MEAN_THRESHOLD and p90_brightness < DARK_P90_THRESHOLD)
        or dark_ratio > DARK_RATIO_THRESHOLD
    )



def is_too_blurry(image: Image.Image) -> bool:
    gray = np.asarray(image.convert("L"), dtype=np.float32)

    padded = np.pad(gray, ((1, 1), (1, 1)), mode="edge")
    laplacian = (
        -4 * padded[1:-1, 1:-1]
        + padded[:-2, 1:-1]
        + padded[2:, 1:-1]
        + padded[1:-1, :-2]
        + padded[1:-1, 2:]
    )

    sharpness = float(laplacian.var())
    return sharpness < BLUR_LAPLACIAN_VARIANCE_THRESHOLD


def validate_image(image: Image.Image) -> str | None:
    if is_too_dark(image):
        return "Image is too dark. Please retake the photo in better lighting."
    if is_too_blurry(image):
        return "Image is too blurry. Please retake the photo with better focus."
    return None


def create_app():
    app = Flask(__name__, static_folder="static", static_url_path="")

    if not MODEL_PATH.exists():
        raise RuntimeError(
            f"Model file not found at {MODEL_PATH}. "
            "Run train_model.py first to train and save the model."
        )

    checkpoint = torch.load(MODEL_PATH, map_location="cpu")
    class_names = checkpoint["class_names"]
    img_size = checkpoint.get("img_size", 224)

    model = models.resnet18(weights=None)
    in_features = model.fc.in_features
    model.fc = torch.nn.Linear(in_features, len(class_names))
    model.load_state_dict(checkpoint["model_state_dict"], strict=True)
    model.eval()

    preprocess = transforms.Compose(
        [
            transforms.Resize((img_size, img_size)),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225],
            ),
        ]
    )

    # ✅ SERVE REACT UI
    @app.route("/")
    def serve_react():
        return send_from_directory(app.static_folder, "index.html")

    # ✅ API ROUTE (ONLY CHANGE)
    @app.route("/predict", methods=["POST"])
    def predict():
        prediction = None
        probability = None
        uploaded_image_url = None
        error = None

        file = request.files.get("image")

        if not file or file.filename == "":
            error = "Please select an image file."
        else:
            try:
                image_bytes = file.read()
                mime_type = file.mimetype or "image/jpeg"
                encoded = base64.b64encode(image_bytes).decode("utf-8")
                uploaded_image_url = f"data:{mime_type};base64,{encoded}"

                image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

                # ✅ VALIDATION (UNCHANGED)
                validation_error = validate_image(image)
                if validation_error:
                    return jsonify({"error": validation_error})

                input_tensor = preprocess(image).unsqueeze(0)

                with torch.no_grad():
                    outputs = model(input_tensor)
                    probs = F.softmax(outputs, dim=1)
                    top_prob, top_idx = torch.max(probs, dim=1)

                prediction = class_names[top_idx.item()]
                probability = float(top_prob.item())

                return jsonify({
                    "prediction": prediction,
                    "probability": probability,
                    "image": uploaded_image_url
                })

            except Exception as exc:
                return jsonify({"error": f"Failed to process image: {exc}"})

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)