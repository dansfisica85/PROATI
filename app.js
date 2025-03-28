import { CONFIG } from './config.js';

class GabaritoApp {
  constructor() {
    this.answerForm = document.getElementById('answerForm');
    this.answerGrid = document.querySelector('.answer-grid');
    this.tabs = document.querySelectorAll('.tab');
    this.tabContents = document.querySelectorAll('.tab-content');
    this.cameraPreview = document.getElementById('cameraPreview');
    this.photoCanvas = document.getElementById('photoCanvas');
    this.startCameraBtn = document.getElementById('startCameraBtn');
    this.captureBtn = document.getElementById('captureBtn');
    this.comparisonResult = document.getElementById('comparisonResult');
    this.stream = null; // To hold the camera stream

    this.initializeAnswerGrid();
    this.setupEventListeners();
    this.loadSavedAnswers();
    // Activate the first tab initially
    this.switchTab(this.tabs[0].dataset.tab);
  }

  initializeAnswerGrid() {
    this.answerGrid.innerHTML = Array.from({ length: CONFIG.QUESTIONS }, (_, i) => `
      <div class="answer-item">
        <label>${i + 1}:</label>
        <select data-question="${i}">
          <option value="">-</option> 
          ${CONFIG.ANSWERS.map(a => `<option value="${a}">${a}</option>`).join('')}
        </select>
      </div>
    `).join('');
  }

  setupEventListeners() {
    // Form submission
    this.answerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveAnswers();
    });

    // Tab switching
    this.tabs.forEach(tab => {
      tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
    });

    // Camera handlers
    this.startCameraBtn.addEventListener('click', () => this.startCamera());
    this.captureBtn.addEventListener('click', () => this.capturePhoto());
  }

  switchTab(tabId) {
    this.tabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabId);
    });
    this.tabContents.forEach(content => {
      content.classList.toggle('active', content.id === tabId);
    });

    // Stop camera if switching away from the compare tab
    if (tabId !== 'compare' && this.stream) {
        this.stopCamera();
    }
    // Reset camera UI visibility when switching to compare tab
    if (tabId === 'compare') {
        this.startCameraBtn.classList.remove('hidden');
        this.cameraPreview.classList.add('hidden');
        this.photoCanvas.classList.add('hidden');
        this.captureBtn.classList.add('hidden');
        this.comparisonResult.innerHTML = ''; // Clear previous results
    }
  }

  saveAnswers() {
    const answers = {};
    const selects = this.answerGrid.querySelectorAll('select');
    selects.forEach(select => {
      answers[select.dataset.question] = select.value;
    });
    localStorage.setItem('gabaritoAnswers', JSON.stringify(answers));
    alert('Respostas salvas com sucesso!');
  }

  loadSavedAnswers() {
    const savedAnswers = JSON.parse(localStorage.getItem('gabaritoAnswers') || '{}');
    const selects = this.answerGrid.querySelectorAll('select');
    selects.forEach(select => {
      const questionIndex = select.dataset.question;
      if (savedAnswers[questionIndex]) {
        select.value = savedAnswers[questionIndex];
      }
    });
  }

  async startCamera() {
      try {
          this.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
          this.cameraPreview.srcObject = this.stream;
          this.cameraPreview.classList.remove('hidden');
          this.startCameraBtn.classList.add('hidden');
          this.captureBtn.classList.remove('hidden');
          this.photoCanvas.classList.add('hidden'); // Hide canvas while previewing
          this.cameraPreview.play(); // Ensure video plays
      } catch (err) {
          console.error("Erro ao acessar a câmera: ", err);
          alert("Não foi possível acessar a câmera. Verifique as permissões.");
          this.startCameraBtn.classList.remove('hidden'); // Show button again if failed
      }
  }

   stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
            this.cameraPreview.srcObject = null;
            this.cameraPreview.classList.add('hidden');
            this.captureBtn.classList.add('hidden');
        }
    }

  capturePhoto() {
    if (!this.stream) return;

    const video = this.cameraPreview;
    const canvas = this.photoCanvas;
    // Set canvas dimensions based on video aspect ratio
    const aspectRatio = video.videoWidth / video.videoHeight;
    canvas.width = video.videoWidth > 600 ? 600 : video.videoWidth; // Limit width for performance
    canvas.height = canvas.width / aspectRatio;

    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Show canvas, hide video preview
    canvas.classList.remove('hidden');
    this.stopCamera(); // Stop camera after capture

    this.analyzePhoto(canvas);
  }

  analyzePhoto(canvas) {
    const detectedAnswers = {}; // Use object for sparse answers
    const ctx = canvas.getContext('2d');

    console.log(`Analyzing canvas: ${canvas.width}x${canvas.height}`);

    ctx.fillStyle = 'red';
    Object.entries(CONFIG.GRID_POSITIONS).forEach(([key, pos]) => {
        ctx.fillRect(pos.x - 2, pos.y - 2, 4, 4); 
    });

    for (let q = 0; q < CONFIG.QUESTIONS; q++) {
      let bestMatch = { answer: null, darkness: -1 };
      for (let a = 0; a < CONFIG.ANSWERS.length; a++) {
        const answerKey = CONFIG.ANSWERS[a];
        const posKey = `${q}_${answerKey}`;
        const pos = CONFIG.GRID_POSITIONS[posKey];

        if (!pos) {
           console.warn(`Position for ${posKey} not found in config.`);
           continue;
        }

        const sampleSize = 5; 
        const x = Math.max(0, pos.x - Math.floor(sampleSize / 2));
        const y = Math.max(0, pos.y - Math.floor(sampleSize / 2));
        const w = Math.min(sampleSize, canvas.width - x);
        const h = Math.min(sampleSize, canvas.height - y);

        if (w <= 0 || h <= 0) {
            console.warn(`Invalid sample area for ${posKey} at (${pos.x}, ${pos.y})`);
            continue;
        }

        try {
            const pixelData = ctx.getImageData(x, y, w, h).data;
            const darkness = this.calculateDarkness(pixelData);
            console.log(`Q${q+1}-${answerKey} at (${pos.x}, ${pos.y}): Darkness = ${darkness.toFixed(1)}`);

            if (darkness > bestMatch.darkness && darkness > CONFIG.DETECTION_THRESHOLD) {
                bestMatch = { answer: answerKey, darkness: darkness };
            }
        } catch (e) {
            console.error(`Error getting image data for ${posKey} at (${x}, ${y}, ${w}, ${h}):`, e);
        }
      }
      if(bestMatch.answer) {
          detectedAnswers[q] = bestMatch.answer;
      }
    }
    console.log("Detected Answers:", detectedAnswers);
    this.compareAnswers(detectedAnswers);
  }

  calculateDarkness(pixelData) {
    if (pixelData.length === 0) return 0;
    let sum = 0;
    for (let i = 0; i < pixelData.length; i += 4) {
      const gray = 0.299 * pixelData[i] + 0.587 * pixelData[i + 1] + 0.114 * pixelData[i + 2];
      sum += (255 - gray); 
    }
    return (sum / (pixelData.length / 4)) / 2.55;
  }

  compareAnswers(detected) {
    const savedAnswers = JSON.parse(localStorage.getItem('gabaritoAnswers') || '{}');
    let html = '<h3>Resultados da Comparação:</h3>';
    let correctCount = 0;

    for (let i = 0; i < CONFIG.QUESTIONS; i++) {
      const saved = savedAnswers[i] || '-'; 
      const detectedAns = detected[i] || '-'; 
      let status = '';
      let icon = '';

      if (saved === '-' && detectedAns === '-') {
          status = 'empty';
          icon = '⚪'; 
      } else if (saved === '-') {
           status = 'only-detected';
           icon = '❓'; 
      } else if (detectedAns === '-') {
          status = 'not-detected';
          icon = '⚠️'; 
      } else if (detected[i] === savedAnswers[i]) {
          status = 'correct';
          icon = '✔️'; 
          correctCount++;
      } else {
          status = 'wrong';
          icon = '❌'; 
      }

      html += `
        <div class="result-item ${status}">
          ${icon} Questão ${i + 1}: Salvo: ${saved} → Foto: ${detectedAns}
        </div>
      `;
    }

    html += `<p><strong>Total de acertos (comparado ao salvo): ${correctCount} de ${CONFIG.QUESTIONS}</strong></p>`;

    this.comparisonResult.innerHTML = html;
    if (document.getElementById('compare').classList.contains('active')) {
         this.comparisonResult.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new GabaritoApp();
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/serviceworker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch(err => {
        console.log('ServiceWorker registration failed: ', err);
      });
  });
}