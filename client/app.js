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
