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
