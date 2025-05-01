document.getElementById('analyze-button').addEventListener('click', function() {
    analyzeSymptoms();
});

document.getElementById('reset-button').addEventListener('click', function() {
    document.getElementById('symptom-form').style.display = 'block';
    document.getElementById('results').style.display = 'none';
    
    // Clear all checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
});

function showUploadOptions(){
    window.location.href = "camera.html";
}
function analyzeSymptoms() {
    document.getElementById('error-message').style.display = 'none';
    const checkedSymptoms = [];
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            checkedSymptoms.push(checkbox.value);
        }
    });
    
    if (checkedSymptoms.length === 0) {
        document.getElementById('error-message').style.display = 'block';
        return;
    }
    
    const results = diagnoseProblems(checkedSymptoms);
    displayResults(results);
    
    document.getElementById('symptom-form').style.display = 'none';
    document.getElementById('results').style.display = 'block';
}

function diagnoseProblems(symptoms) {
    const problems = [];
    
    // Engine problems
    if (symptoms.includes('engine-noise') || symptoms.includes('engine-knocking')) {
        problems.push({
            title: 'Potential Internal Engine Damage',
            description: 'Knocking or unusual noises could indicate worn bearings, damaged pistons, or valve train issues.',
            severity: 'high'
        });
    }
    
    if (symptoms.includes('engine-smoke')) {
        if (symptoms.includes('fluid-oil-leak')) {
            problems.push({
                title: 'Piston Ring or Valve Seal Failure',
                description: 'Blue smoke with oil consumption indicates oil is entering the combustion chamber, likely due to worn piston rings or valve seals.',
                severity: 'high'
            });
        } else {
            problems.push({
                title: 'Combustion Issue',
                description: 'Smoke from the exhaust can indicate various internal problems depending on color (black: rich fuel mixture, white: coolant leak, blue: oil burning).',
                severity: 'medium'
            });
        }
    }
    
    if (symptoms.includes('engine-misfire') || symptoms.includes('engine-power-loss')) {
        problems.push({
            title: 'Cylinder Compression Issue',
            description: 'Misfiring and power loss could indicate a loss of compression due to worn piston rings, damaged valves, or a blown head gasket.',
            severity: 'medium'
        });
    }
    
    // Transmission problems
    if (symptoms.includes('transmission-slip') || symptoms.includes('transmission-delay')) {
        problems.push({
            title: 'Internal Transmission Damage',
            description: 'Slipping or delayed engagement points to worn clutch packs, damaged bands, or valve body issues in the transmission.',
            severity: 'high'
        });
    }
    
    if (symptoms.includes('transmission-grinding') || symptoms.includes('transmission-noise')) {
        problems.push({
            title: 'Transmission Gear Damage',
            description: 'Grinding or abnormal noises could indicate damaged gears, bearings, or synchronizers within the transmission.',
            severity: 'high'
        });
    }
    
    // Fluid/leak related issues
    if (symptoms.includes('fluid-coolant-leak') && (symptoms.includes('warning-temperature') || symptoms.includes('engine-power-loss'))) {
        problems.push({
            title: 'Head Gasket Failure',
            description: 'Coolant leaks combined with overheating are classic signs of a blown head gasket, which can allow coolant into cylinders.',
            severity: 'high'
        });
    }
    
    if (symptoms.includes('fluid-oil-leak') && symptoms.includes('warning-oil-pressure')) {
        problems.push({
            title: 'Oil Pump Failure or Main Bearing Damage',
            description: 'Oil leaks with low oil pressure can indicate a failing oil pump or worn engine bearings, which can quickly lead to catastrophic engine failure.',
            severity: 'high'
        });
    }
    
    // Performance issues
    if (symptoms.includes('performance-fuel-economy') && symptoms.includes('engine-misfire')) {
        problems.push({
            title: 'Fuel System or Ignition System Damage',
            description: 'Poor fuel economy with misfiring could indicate damaged fuel injectors, ignition coils, or sensor failures.',
            severity: 'medium'
        });
    }
    
    if (symptoms.includes('performance-vibration')) {
        if (symptoms.includes('engine-knocking')) {
            problems.push({
                title: 'Engine Mount or Balance Shaft Issue',
                description: 'Vibrations with knocking could indicate a damaged engine mount or balance shaft problem inside the engine.',
                severity: 'medium'
            });
        } else {
            problems.push({
                title: 'Drivetrain Imbalance',
                description: 'Vibrations could indicate an internal issue with CV joints, driveshaft, or transmission components.',
                severity: 'medium'
            });
        }
    }
    
    // Warning lights related issues
    if (symptoms.includes('warning-check-engine') && (symptoms.includes('engine-power-loss') || symptoms.includes('engine-misfire'))) {
        problems.push({
            title: 'Major Engine Management System Issue',
            description: 'Check engine light with performance issues could indicate serious internal problems that need diagnostic scanning.',
            severity: 'medium'
        });
    }
    
    if (symptoms.includes('warning-oil-pressure')) {
        problems.push({
            title: 'Critical Oil System Failure',
            description: 'Oil pressure warning light indicates potentially serious oil pump failure or critically low oil levels that can cause immediate engine damage.',
            severity: 'high'
        });
    }
    
    // Add generic problem if nothing specific was identified
    if (problems.length === 0) {
        problems.push({
            title: 'Multiple Minor Issues',
            description: 'The symptoms you selected may indicate minor issues that require further investigation but don\'t clearly point to specific internal damage.',
            severity: 'low'
        });
    }
    
    // Generate recommendations based on findings
    const recommendations = generateRecommendations(problems, symptoms);
    
    return {
        problems: problems,
        recommendations: recommendations
    };
}

function generateRecommendations(problems, symptoms) {
    const recommendations = [];
    const hasHighSeverity = problems.some(p => p.severity === 'high');
    
    if (hasHighSeverity) {
        recommendations.push('Stop driving the vehicle immediately to prevent further damage');
        recommendations.push('Have the vehicle towed to a qualified repair shop');
    }
    
    if (symptoms.includes('warning-check-engine') || symptoms.includes('warning-abs') || 
        symptoms.includes('warning-traction')) {
        recommendations.push('Get a diagnostic scan to retrieve error codes');
    }
    
    if (symptoms.includes('engine-noise') || symptoms.includes('engine-knocking') || 
        symptoms.includes('transmission-noise')) {
        recommendations.push('Have a mechanic perform an auditory inspection to pinpoint the source of the noise');
    }
    
    if (symptoms.includes('fluid-coolant-leak') || symptoms.includes('fluid-oil-leak') || 
        symptoms.includes('fluid-transmission-leak')) {
        recommendations.push('Check all fluid levels and inspect for visible leaks');
    }
    
    // Always recommend professional inspection
    recommendations.push('Schedule a comprehensive professional inspection');
    
    return recommendations;
}

function displayResults(results) {
    const problemsContainer = document.getElementById('problems-container');
    const recommendationsContainer = document.getElementById('recommendations');
    
    problemsContainer.innerHTML = '';
    recommendationsContainer.innerHTML = '';
    
    // Display problems
    results.problems.forEach(problem => {
        const problemElement = document.createElement('div');
        problemElement.className = 'problem-item';
        
        problemElement.innerHTML = `
            <div class="problem-title">${problem.title} <span class="severity ${problem.severity}">${problem.severity.toUpperCase()}</span></div>
            <div class="problem-description">${problem.description}</div>
        `;
        
        problemsContainer.appendChild(problemElement);
    });
    
    // Display recommendations
    results.recommendations.forEach(recommendation => {
        const li = document.createElement('li');
        li.textContent = recommendation;
        recommendationsContainer.appendChild(li);
    });
}