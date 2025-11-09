import os
import numpy as np
from PIL import Image
from transformers import CLIPProcessor, CLIPModel
import torch
import csv

# ----- USER SETTINGS -----
INPUT_IMAGE = './cats/970807.jpeg'
HANDDRAWN_DIR = './handdrawn_cats'
CSV_OUTPUT = 'match_result.csv'

# ----- LOAD MODEL -----
print("Loading CLIP model...")
model = CLIPModel.from_pretrained("laion/CLIP-ViT-H-14-laion2B-s32B-b79K")
processor = CLIPProcessor.from_pretrained("laion/CLIP-ViT-H-14-laion2B-s32B-b79K")

# ----- HELPER: compute embedding -----
def get_embedding(image_path):
    image = Image.open(image_path).convert("RGB")
    inputs = processor(images=image, return_tensors="pt")
    with torch.no_grad():
        outputs = model.get_image_features(**inputs)
    # Normalize embedding
    return outputs[0].cpu().numpy() / np.linalg.norm(outputs[0].cpu().numpy())

# ----- PRECOMPUTE HAND-DRAWN EMBEDDINGS -----
print("Computing hand-drawn embeddings...")
hand_embeddings = {}
for fname in os.listdir(HANDDRAWN_DIR):
    path = os.path.join(HANDDRAWN_DIR, fname)
    hand_embeddings[fname] = get_embedding(path)

# ----- COMPUTE INPUT IMAGE EMBEDDING -----
print("Computing input image embedding...")
input_emb = get_embedding(INPUT_IMAGE)

# ----- COMPARE USING COSINE SIMILARITY -----
def cosine_similarity(a, b):
    return np.dot(a, b)

best_match = None
best_score = -1
for fname, emb in hand_embeddings.items():
    score = cosine_similarity(input_emb, emb)
    if score > best_score:
        best_score = score
        best_match = fname

print(f"Best match for {INPUT_IMAGE}: {best_match} (similarity: {best_score:.4f})")

# ----- SAVE TO CSV -----
with open(CSV_OUTPUT, "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["InputImage", "BestHandDrawnMatch", "Similarity"])
    writer.writerow([INPUT_IMAGE, best_match, best_score])

print(f"Saved results to {CSV_OUTPUT}")
