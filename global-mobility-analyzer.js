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

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // 1. Enter Loading State
        btnText.style.display = 'none';
        btnSpinner.style.display = 'block';
        form.querySelector('button').disabled = true;

        placeholderPanel.classList.remove('active');
        resultPanel.classList.remove('active');
        loadingPanel.classList.add('active');

        // Capture data for simulation
        const formData = {
            name: document.getElementById('applicant-name').value,
            origin: document.getElementById('origin-country').value,
            destination: document.getElementById('dest-country').value,
            visaType: document.getElementById('visa-type').value,
            experience: parseInt(document.getElementById('experience').value),
            skills: document.getElementById('skills').value.split(',').map(s => s.trim())
        };

        // Simulate ML Inference Delay (2.5s)
        setTimeout(() => {
            simulateInferenceOutput(formData);
        }, 2500);
    });

    function simulateInferenceOutput(data) {
        // Mock prediction logic based on form input inputs just to have dynamic output
        let score = 45; // base
        
        if (data.experience > 3) score += 15;
        if (data.experience > 8) score += 10;
        
        const highDemandSkills = ['python', 'machine learning', 'software engineering', 'ai', 'data science', 'nursing'];
        const matchesSkill = data.skills.some(skill => highDemandSkills.includes(skill.toLowerCase()));
        
        if (matchesSkill) score += 25;
        
        if (data.visaType === 'skilled_worker') score += 5;
        
        // Add random variance between -5 and +5
        score += Math.floor(Math.random() * 11) - 5;
        
        // Clamp to 10-98 (realistic model bounds)
        score = Math.max(10, Math.min(98, score));

        // Define Risk
        let risk = 'Low';
        let riskClass = 'risk-low';
        let color = '#10b981'; // success
        
        if (score < 50) {
            risk = 'High';
            riskClass = 'risk-high';
            color = '#ef4444'; // danger
        } else if (score < 75) {
            risk = 'Medium';
            riskClass = 'risk-medium';
            color = '#f59e0b'; // warning
        }

        // 2. Hide loading, show results
        loadingPanel.classList.remove('active');
        resultPanel.classList.add('active');
        
        btnText.style.display = 'block';
        btnSpinner.style.display = 'none';
        form.querySelector('button').disabled = false;

        // Animate Circle
        animateCircle(score, color);

        // Update DOM Elements
        document.getElementById('risk-level').textContent = risk;
        document.getElementById('risk-level').className = `metric-value ${riskClass}`;
        
        const factorList = document.getElementById('factor-list');
        factorList.innerHTML = '';
        
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
            "model_version": "v2.1.0-prod",
            "timestamp": new Date().toISOString(),
            "inputs": data,
            "predictions": {
                "approval_probability": score / 100,
                "confidence_score": 0.89,
                "risk_category": risk.toUpperCase(),
                "estimated_processing_days": Math.floor(Math.random() * 60) + 120
            },
            "features_importance": {
                "skills_match": 0.42,
                "experience_yrs": 0.28,
                "origin_dest_correl": 0.15,
                "visa_class": 0.15
            }
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
