from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def compute_similarity_score(job_desc, resume):
    """Computes similarity score between job description and resume."""
    documents = [job_desc, resume]
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(documents)
    similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
    return similarity

def recommend_jobs(resume, job_descriptions):
    """Recommends jobs based on similarity to resume."""
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform([resume] + job_descriptions)
    similarity_scores = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:])[0]
    sorted_indices = similarity_scores.argsort()[::-1]
    return sorted_indices, similarity_scores
