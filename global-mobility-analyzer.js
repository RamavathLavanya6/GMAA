document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('analyzer-form');
    const placeholderPanel = document.getElementById('placeholder');
    const loadingPanel = document.getElementById('loading-state');
    const resultPanel = document.getElementById('prediction-result');
    const btnText = form.querySelector('span');
    const btnSpinner = document.getElementById('btn-spinner');
    
    const probabilityCircle = document.getElementById('probability-circle');
    const probabilityValue = document.getElementById('probability-value');
    
    const modal = document.getElementById('json-modal');
    const rawBtn = document.getElementById('raw-json-btn');
    const closeModalBtn = document.getElementById('close-modal');

    // Make placeholder visible initially
    placeholderPanel.classList.add('active');

    function resetLoading() {
        btnText.style.display = 'block';
        btnSpinner.style.display = 'none';
        form.querySelector('button').disabled = false;
        loadingPanel.classList.remove('active');
        placeholderPanel.classList.add('active');
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // 1. Enter Loading State
        btnText.style.display = 'none';
        btnSpinner.style.display = 'block';
        form.querySelector('button').disabled = true;

        placeholderPanel.classList.remove('active');
        resultPanel.classList.remove('active');
        loadingPanel.classList.add('active');

        // Capture data
        const formData = {
            name: document.getElementById('applicant-name').value,
            origin: document.getElementById('origin-country').value,
            destination: document.getElementById('dest-country').value,
            visaType: document.getElementById('visa-type').value,
            experience: parseInt(document.getElementById('experience').value),
            skills: document.getElementById('skills').value.split(',').map(s => s.trim())
        };

        // Call the Monitored ML Endpoint (FastAPI)
        fetch('http://127.0.0.1:8000/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw err; });
            }
            return response.json();
        })
        .then(data => {
            if(data.status === "success") {
                renderInferenceOutput(formData, data);
            }
        })
        .catch(err => {
            console.error("API Error:", err);
            alert("Failed to connect to ML Endpoint at http://127.0.0.1:8000.\nMake sure you run `python app.py` first!");
            resetLoading();
        });
    });

    function renderInferenceOutput(data, apiResponse) {
        // 2. Hide loading, show results
        loadingPanel.classList.remove('active');
        resultPanel.classList.add('active');
        
        btnText.style.display = 'block';
        btnSpinner.style.display = 'none';
        form.querySelector('button').disabled = false;

        const score = Math.round(apiResponse.predictions.approval_probability * 100);
        const risk = apiResponse.predictions.risk_category;
        
        let riskClass = 'risk-low';
        let color = '#10b981'; // success
        
        if (risk === 'HIGH') {
            riskClass = 'risk-high';
            color = '#ef4444';
        } else if (risk === 'MEDIUM') {
            riskClass = 'risk-medium';
            color = '#f59e0b';
        }

        // Animate Circle
        animateCircle(score, color);

        // Update DOM Elements
        document.getElementById('risk-level').textContent = risk;
        document.getElementById('risk-level').className = `metric-value ${riskClass}`;
        
        const factorList = document.getElementById('factor-list');
        factorList.innerHTML = '';
        
        const highDemandSkills = ['python', 'machine learning', 'software engineering', 'ai', 'data science'];
        const matchesSkill = data.skills.some(skill => highDemandSkills.includes(skill.toLowerCase()));
        
        if (matchesSkill) {
            factorList.innerHTML += `<li><span class="impact positive">+</span> High demand skill profile matched</li>`;
        }
        if (data.experience >= 5) {
            factorList.innerHTML += `<li><span class="impact positive">+</span> Strong professional experience (${data.experience} yrs)</li>`;
        } else {
            factorList.innerHTML += `<li><span class="impact negative">-</span> Below average experience</li>`;
        }
        
        factorList.innerHTML += `<li><span class="impact positive">+</span> Valid destination routing</li>`;
        
        // Save raw JSON for modal
        const rawJson = {
            "request_payload": data,
            "api_response": apiResponse
        };
        
        document.getElementById('json-output').textContent = JSON.stringify(rawJson, null, 2);
    }

    function animateCircle(targetScore, color) {
        let currentScore = 0;
        const interval = setInterval(() => {
            currentScore += 1;
            probabilityValue.textContent = `${currentScore}%`;
            probabilityCircle.style.background = `conic-gradient(${color} ${currentScore * 3.6}deg, rgba(255,255,255,0.05) 0deg)`;
            
            if (currentScore >= targetScore) {
                clearInterval(interval);
            }
        }, 30);
    }

    // Modal behavior
    rawBtn.addEventListener('click', () => {
        modal.classList.add('show');
    });

    closeModalBtn.addEventListener('click', () => {
        modal.classList.remove('show');
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
});
