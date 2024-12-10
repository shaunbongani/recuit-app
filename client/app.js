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
    