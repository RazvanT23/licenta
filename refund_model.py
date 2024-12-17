import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, classification_report
import joblib

# Load the dataset
data = pd.read_csv("refund_data.csv")

# Define features and target
X = data["reason"]
y = data["label"]

# Split into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Create a pipeline with TfidfVectorizer and LogisticRegression
pipeline = Pipeline([
    ('vectorizer', TfidfVectorizer(ngram_range=(1, 2), stop_words='english')),
    ('classifier', LogisticRegression(random_state=42))
])

# Train the model
pipeline.fit(X_train, y_train)

# Save the trained model
joblib.dump(pipeline, "refund_model.pkl")

# Evaluate the model
train_predictions = pipeline.predict(X_train)
test_predictions = pipeline.predict(X_test)

print("Training Accuracy:", accuracy_score(y_train, train_predictions))
print("Testing Accuracy:", accuracy_score(y_test, test_predictions))
print("Classification Report on Test Set:\n", classification_report(y_test, test_predictions))
