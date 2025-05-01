// DOM Elements
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
const cameraBtn = document.getElementById('cameraBtn');
const analyzeBtn = document.getElementById('analyzeBtn');
const previewContainer = document.getElementById('previewContainer');
const previewImage = document.getElementById('previewImage');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const resultsSection = document.getElementById('resultsSection');
const resultsList = document.getElementById('resultsList');

// Camera elements
const cameraContainer = document.getElementById('cameraContainer');
const video = document.getElementById('video');
const captureBtn = document.getElementById('captureBtn');
const closeCameraBtn = document.getElementById('closeCameraBtn');
const canvas = document.getElementById('canvas');

let stream = null;

// Event Listeners
uploadBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', handleFileSelect);
cameraBtn.addEventListener('click', openCamera);
analyzeBtn.addEventListener('click', analyzeImage);
captureBtn.addEventListener('click', capturePhoto);
closeCameraBtn.addEventListener('click', closeCamera);

// Handle file selection
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImage.src = e.target.result;
            previewContainer.classList.remove('hidden');
            analyzeBtn.disabled = false;
            resultsSection.style.display = 'none';
            hideError();
        };
        reader.readAsDataURL(file);
    }
}

// Open camera
function openCamera() {
    cameraContainer.classList.remove('hidden');
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(mediaStream => {
            stream = mediaStream;
            video.srcObject = mediaStream;
            hideError();
        })
        .catch(err => {
            closeCamera();
            showError('Unable to access camera. Please check permissions or try uploading a photo instead.');
            console.error('Error accessing camera:', err);
        });
}

// Close camera
function closeCamera() {
    cameraContainer.classList.add('hidden');
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
}

// Capture photo from camera
function capturePhoto() {
    if (video.videoWidth === 0 || video.videoHeight === 0) {
        showError('Camera not ready. Please try again.');
        return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const imageData = canvas.toDataURL('image/jpeg');
    previewImage.src = imageData;
    previewContainer.classList.remove('hidden');
    analyzeBtn.disabled = false;
    closeCamera();
}

// Analyze the image
function analyzeImage() {
    showLoading();
    analyzeBtn.disabled = true;
    
    // Simulated analysis - in a real app, this would call your backend API
    setTimeout(() => {
        // This simulates the result from an AI model
        const results = detectCarDamages();
        displayResults(results);
        hideLoading();
        analyzeBtn.disabled = false;
    }, 2000);
}

// Simulated detection function (replace with actual API call)
function detectCarDamages() {
    // Simulate different types of issues with varying severities
    const possibleIssues = [
        {
            location: 'Engine Bay',
            issue: 'Oil Leak',
            severity: 'Medium',
            confidence: 87,
            description: 'Possible oil leak detected near the valve cover gasket.',
            recommendations: 'Inspect valve cover gasket and surrounding area for oil residue. Consider replacing the gasket if leaking.'
        },
        {
            location: 'Engine Bay',
            issue: 'Corrosion',
            severity: 'Low',
            confidence: 72,
            description: 'Minor corrosion detected on battery terminals.',
            recommendations: 'Clean battery terminals and apply anti-corrosion solution. Monitor for proper electrical function.'
        },
        {
            location: 'Cooling System',
            issue: 'Coolant Residue',
            severity: 'High',
            confidence: 91,
            description: 'Coolant residue detected around radiator hose connection.',
            recommendations: 'Inspect for coolant leaks and check hose connections. Immediate attention required to prevent overheating.'
        },
        {
            location: 'Engine Bay',
            issue: 'Worn Belt',
            severity: 'Medium',
            confidence: 83,
            description: 'Signs of wear on the serpentine belt.',
            recommendations: 'Inspect belt for cracks or fraying. Consider replacement if significant wear is visible.'
        },
        {
            location: 'Electrical System',
            issue: 'Loose Connection',
            severity: 'Low',
            confidence: 68,
            description: 'Potential loose connection in the wiring harness.',
            recommendations: 'Check wiring connections and secure any loose cables. Test electrical components for proper function.'
        }
    ];
    
    // Randomly select 1-3 issues to display
    const numIssues = Math.floor(Math.random() * 3) + 1;
    const shuffled = [...possibleIssues].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numIssues);
}

// Display the results
function displayResults(results) {
    resultsList.innerHTML = '';
    
    if (results.length === 0) {
        const noIssuesEl = document.createElement('div');
        noIssuesEl.innerHTML = `
            <div class="flex-center gap-2" style="margin: 30px 0; color: var(--success);">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span style="font-size: 1.1rem; font-weight: 500;">No issues detected</span>
            </div>
        `;
        resultsList.appendChild(noIssuesEl);
    } else {
        results.forEach(result => {
            const li = document.createElement('li');
            li.className = 'result-item';
            li.innerHTML = `
                <div class="result-header">
                    <div>
                        <span class="result-title">${result.location} - ${result.issue}</span>
                        <span class="severity-badge severity-${result.severity.toLowerCase()}">${result.severity}</span>
                    </div>
                    <div class="result-confidence">${result.confidence}% confidence</div>
                </div>
                <div class="result-body">
                    ${result.description}
                </div>
                <div class="result-recommendations">
                    <strong>Recommendation:</strong> ${result.recommendations}
                </div>
            `;
            resultsList.appendChild(li);
        });
    }
    
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Utility functions
function showError(message) {
    errorText.textContent = message;
    errorMessage.style.display = 'flex';
}

function hideError() {
    errorMessage.style.display = 'none';
}

function showLoading() {
    loadingSpinner.style.display = 'block';
}

function hideLoading() {
    loadingSpinner.style.display = 'none';
}