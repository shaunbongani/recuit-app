from flask import Flask, request, jsonify
from utils import compute_similarity_score
from sklearn.cluster import KMeans


app = Flask(__name__)

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

