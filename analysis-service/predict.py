import json
import numpy as np
import os
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification


def predict_emotion(texts, model_dir, thresholds_path):
    label_names = ["joy", "interest", "surprise", "sadness", "anger", "disgust", "fear", "guilt", "neutral"]

    # загрузка модели и токенизатора
    tok = AutoTokenizer.from_pretrained(model_dir)
    model = AutoModelForSequenceClassification.from_pretrained(model_dir)
    model.eval()

    # пороги для мультилейбл классификации
    thresholds = np.array(json.load(open(os.path.join(model_dir, thresholds_path))))

    # токенизация
    enc = tok(texts, return_tensors="pt", truncation=True, padding=True)

    with torch.no_grad():
        logits = model(**enc).logits
    probs = torch.sigmoid(logits).cpu().numpy()

    results = []
    for prob_vector in probs:
        # Получаем индекс максимальной вероятности
        max_index = int(np.argmax(prob_vector))
        predicted_emotion = label_names[max_index]

        # (оставляем старую логику, если нужно, но добавляем top-emotion)
        preds = (prob_vector > thresholds).astype(int)
        results.append({
            "top_emotion": predicted_emotion,
            "probs": dict(zip(label_names, prob_vector.tolist())),
            "labels": [name for name, p in zip(label_names, preds) if p]
        })
    return results


def predict_sentiment(texts, model_dir):
    label_names = ["negative", "neutral", "positive"]

    # загрузка модели и токенизатора
    tokenizer = AutoTokenizer.from_pretrained(model_dir)
    model = AutoModelForSequenceClassification.from_pretrained(model_dir)
    model.eval()

    # токенизация
    enc = tokenizer(texts, return_tensors="pt", truncation=True, padding=True)

    with torch.no_grad():
        logits = model(**enc).logits
    probs = torch.softmax(logits, dim=1).cpu().numpy()
    preds = np.argmax(probs, axis=1)

    results = []
    for i, text in enumerate(texts):
        sentiment = label_names[preds[i]]
        results.append({
            "top_sentiment": sentiment,
            "probs": dict(zip(label_names, probs[i].tolist()))
        })
    return results