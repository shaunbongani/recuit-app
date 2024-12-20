fetch('http://localhost:3001/jobs')
    .then(response => response.json())
    .then(data => {
        const jobList = document.getElementById('job-list');
        jobList.innerHTML = data.map(job => `
            <div>
                <h3>${job.title}</h3>
                <p>${job.description}</p>
                <p><em>Posted by: ${job.postedBy}</em></p>
            </div>
        `).join('');
    });

    const resumeForm = document.getElementById('resume-form');
    resumeForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const data = {
            resume: document.getElementById('resume-content').value,
            job_desc: document.getElementById('job-desc').value
        };
    
        fetch('http://localhost:5000/score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => alert(`Match Score: ${result.score}%`))
        .catch(error => console.error('Error:', error));
    });
    


// Fetch Match Scores
function fetchMatchScores(jobDesc, resumes) {
    fetch('http://localhost:5000/match-scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_desc: jobDesc, resumes: resumes })
    })
    .then(response => response.json())
    .then(data => renderMatchScoresChart(data.scores))
    .catch(error => console.error('Error fetching match scores:', error));
}

// Render Match Scores Chart
function renderMatchScoresChart(scores) {
    const ctx = document.getElementById('match-scores-chart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: scores.map((_, i) => `Resume ${i + 1}`),
            datasets: [{
                label: 'Match Scores (%)',
                data: scores,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

// Fetch Clustering Results
function fetchClusteringResults(resumes) {
    fetch('http://localhost:5000/cluster-resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumes: resumes })
    })
    .then(response => response.json())
    .then(data => renderClusteringChart(data.clusters))
    .catch(error => console.error('Error fetching clustering results:', error));
}

// Render Clustering Chart
function renderClusteringChart(clusters) {
    const clusterCounts = clusters.reduce((acc, cluster) => {
        acc[cluster] = (acc[cluster] || 0) + 1;
        return acc;
    }, {});

    const ctx = document.getElementById('clustering-chart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(clusterCounts).map(c => `Cluster ${c}`),
            datasets: [{
                data: Object.values(clusterCounts),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
            }]
        }
    });
}



function fetchJobRecommendations(resume, jobDescriptions) {
    fetch('http://localhost:5000/recommend-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume: resume, job_descriptions: jobDescriptions })
    })
    .then(response => response.json())
    .then(data => renderJobRecommendations(data))
    .catch(error => console.error('Error fetching recommendations:', error));
}

function renderJobRecommendations(recommendations) {
    const recommendationList = document.getElementById('recommendations');
    recommendationList.innerHTML = recommendations.map(rec => `
        <div>
            <h4>Job ${rec.job_index + 1}</h4>
            <p>Score: ${rec.score}%</p>
        </div>
    `).join('');
}

// Handle Login
const loginForm = document.getElementById('login-form');
const loginMessage = document.getElementById('login-message');
const dashboardDiv = document.getElementById('dashboard');

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            loginMessage.textContent = data.error;
        } else {
            loginMessage.textContent = `Login successful! Role: ${data.role}`;
            fetchDashboard();
        }
    })
    .catch(error => console.error('Error during login:', error));
});

// Fetch Dashboard Data
function fetchDashboard() {
    fetch('http://localhost:5000/dashboard', {
        credentials: 'include' // Include cookies for authenticated requests
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            dashboardDiv.textContent = data.error;
        } else {
            dashboardDiv.textContent = data.message;
        }
    })
    .catch(error => console.error('Error fetching dashboard:', error));
}
