from flask import Flask, request, jsonify
from utils import compute_similarity_score
from sklearn.cluster import KMeans
from flask import Flask, request, jsonify, redirect, url_for
from flask_login import LoginManager, UserMixin, login_user, logout_user, current_user, login_required
from werkzeug.security import generate_password_hash, check_password_hash



app = Flask(__name__)

app.secret_key = '9905235172088'  # Replace with a strong secret key

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "Shaun"

@login_manager.user_loader
def load_user(user_id):
    user = next((u for u in users if u["id"] == int(user_id)), None)
    if user:
        return User(user["id"], user["username"], user["role"])
    return None

users = [
    {"id": 1, "username": "recruiter", "password": generate_password_hash("recruiterpass"), "role": "recruiter"},
    {"id": 2, "username": "applicant", "password": generate_password_hash("applicantpass"), "role": "applicant"}
]

class User(UserMixin):
    def __init__(self, id, username, role):
        self.id = id
        self.username = username
        self.role = role

@login_manager.user_loader
def load_user(user_id):
    user = next((u for u in users if u["id"] == int(user_id)), None)
    if user:
        return User(user["id"], user["username"], user["role"])
    return None



# Helper function to find a user by username
def find_user_by_username(username):
    for user in users:
        if user['username'] == username:
            return user
    return None



@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    user = find_user_by_username(username)
    if user and check_password_hash(user["password"], password):
        login_user(User(user["id"], user["username"], user["role"]))
        return jsonify({"message": "Login successful", "role": user["role"]})

    return jsonify({"error": "Invalid credentials"}), 401

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logged out successfully"})


@app.route('/dashboard')
@login_required
def dashboard():
    if current_user.role == "recruiter":
        return jsonify({"message": "Welcome, recruiter! You can access the dashboard."})
    return jsonify({"error": "Access denied"}), 403


@app.route('/score', methods=['POST'])
def score():
    data = request.json
    resume = data['resume']
    job_desc = data['job_desc']

    # Compute similarity score
    score = compute_similarity_score(job_desc, resume)
    return jsonify({"score": round(score * 100, 2)})

if __name__ == '__main__':
    app.run(debug=True)


@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.json
    resume = data['resume']
    job_descriptions = data['job_descriptions']
    
    indices, scores = recommend_jobs(resume, job_descriptions)
    recommendations = [{"job_index": int(idx), "score": round(score * 100, 2)} for idx, score in zip(indices, scores)]
    return jsonify(recommendations)

def cluster_applicants(resumes, n_clusters=3):
    """Clusters resumes into groups."""
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(resumes)
    kmeans = KMeans(n_clusters=n_clusters, random_state=42)
    kmeans.fit(tfidf_matrix)
    clusters = kmeans.labels_
    return clusters

@app.route('/cluster-resumes', methods=['POST'])
def cluster_resumes():
    data = request.json
    resumes = data['resumes']

    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(resumes)
    kmeans = KMeans(n_clusters=3, random_state=42)
    kmeans.fit(tfidf_matrix)

    clusters = kmeans.labels_.tolist()
    return jsonify({"clusters": clusters})



@app.route('/recommend-jobs', methods=['POST'])
def recommend_jobs():
    data = request.json
    resume = data['resume']
    job_descriptions = data['job_descriptions']

    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform([resume] + job_descriptions)
    scores = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:])[0]

    recommendations = [{"job_index": i, "score": round(score * 100, 2)} for i, score in enumerate(scores)]
    recommendations.sort(key=lambda x: x['score'], reverse=True)
    return jsonify(recommendations)

