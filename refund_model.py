import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report
import joblib



# Load your data
data = pd.read_csv("refund_data.csv")  # Columns: reason, order_amount, previous_refunds, label

# Feature engineering
vectorizer = TfidfVectorizer(max_features=500)  # Convert text to numerical vectors
X_reason = vectorizer.fit_transform(data["reason"])
X_numeric = data[["order_amount", "previous_refunds"]].values
X = pd.concat([pd.DataFrame(X_reason.toarray()), pd.DataFrame(X_numeric)], axis=1)
y = data["label"]

# Split into training and testing
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the model
model = LogisticRegression()
model.fit(X_train, y_train)


joblib.dump(model, "refund_model.pkl")
joblib.dump(vectorizer, "refund_vectorizer.pkl")

# Evaluate the model
y_pred = model.predict(X_test)
print("Accuracy:", accuracy_score(y_test, y_pred))
print(classification_report(y_test, y_pred))
