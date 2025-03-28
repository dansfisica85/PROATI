// Configuration constants
export const CONFIG = {
  QUESTIONS: 20,
  ANSWERS: ['A', 'B', 'C', 'D', 'E'],
  DETECTION_THRESHOLD: 35, // Sensitivity for mark detection (0-100). Lower means more sensitive. Needs calibration.
  GRID_POSITIONS: {
    // !! IMPORTANT !! CALIBRATION REQUIRED !!
    // These coordinates are ESTIMATES based on the visual layout of the provided
    // 'proati_2025_answer_sheet' image (Imagem do WhatsApp...).
    // They assume the image is captured and drawn onto a canvas (e.g., ~600-800px wide).
    // YOU MUST ADJUST these (x, y) pixel values for YOUR specific setup.
    //
    // How to Calibrate:
    // 1. Run the app, go to the "Comparar com Foto" tab.
    // 2. Open your browser's Developer Tools (usually F12).
    // 3. Click "Abrir Câmera", point it at your answer sheet, and click "Analisar Foto".
    // 4. In the Developer Tools, find the <canvas id="photoCanvas"> element.
    // 5. Inspect the canvas. You might need console commands or an inspection tool
    //    to find the exact (x, y) pixel coordinates for the CENTER of each answer circle (A-E for Q1-20).
    //    Look for the red dots drawn by the analyzePhoto function - these mark the current coordinates.
    // 6. Update the corresponding 'q_A', 'q_B', etc. values below with the coordinates you found.
    // 7. Repeat until the red dots align perfectly with the centers of the circles on the canvas.

    // --- Estimates for Column 1 (Questions 1-10) ---
    // Base start estimate for Q1_A: x=150, y=200
    // Horizontal step estimate (A->B): 50px
    // Vertical step estimate (Q1->Q2): 35px
    '0_A': { x: 150, y: 200 }, '0_B': { x: 200, y: 200 }, '0_C': { x: 250, y: 200 }, '0_D': { x: 300, y: 200 }, '0_E': { x: 350, y: 200 },
    '1_A': { x: 150, y: 235 }, '1_B': { x: 200, y: 235 }, '1_C': { x: 250, y: 235 }, '1_D': { x: 300, y: 235 }, '1_E': { x: 350, y: 235 },
    '2_A': { x: 150, y: 270 }, '2_B': { x: 200, y: 270 }, '2_C': { x: 250, y: 270 }, '2_D': { x: 300, y: 270 }, '2_E': { x: 350, y: 270 },
    '3_A': { x: 150, y: 305 }, '3_B': { x: 200, y: 305 }, '3_C': { x: 250, y: 305 }, '3_D': { x: 300, y: 305 }, '3_E': { x: 350, y: 305 },
    '4_A': { x: 150, y: 340 }, '4_B': { x: 200, y: 340 }, '4_C': { x: 250, y: 340 }, '4_D': { x: 300, y: 340 }, '4_E': { x: 350, y: 340 },
    '5_A': { x: 150, y: 375 }, '5_B': { x: 200, y: 375 }, '5_C': { x: 250, y: 375 }, '5_D': { x: 300, y: 375 }, '5_E': { x: 350, y: 375 },
    '6_A': { x: 150, y: 410 }, '6_B': { x: 200, y: 410 }, '6_C': { x: 250, y: 410 }, '6_D': { x: 300, y: 410 }, '6_E': { x: 350, y: 410 },
    '7_A': { x: 150, y: 445 }, '7_B': { x: 200, y: 445 }, '7_C': { x: 250, y: 445 }, '7_D': { x: 300, y: 445 }, '7_E': { x: 350, y: 445 },
    '8_A': { x: 150, y: 480 }, '8_B': { x: 200, y: 480 }, '8_C': { x: 250, y: 480 }, '8_D': { x: 300, y: 480 }, '8_E': { x: 350, y: 480 },
    '9_A': { x: 150, y: 515 }, '9_B': { x: 200, y: 515 }, '9_C': { x: 250, y: 515 }, '9_D': { x: 300, y: 515 }, '9_E': { x: 350, y: 515 },

    // --- Estimates for Column 2 (Questions 11-20) ---
    // Base start estimate for Q11_A: x=450, y=200 (Same Y as Q1)
    // Using same step estimates as Column 1
    '10_A': { x: 450, y: 200 }, '10_B': { x: 500, y: 200 }, '10_C': { x: 550, y: 200 }, '10_D': { x: 600, y: 200 }, '10_E': { x: 650, y: 200 },
    '11_A': { x: 450, y: 235 }, '11_B': { x: 500, y: 235 }, '11_C': { x: 550, y: 235 }, '11_D': { x: 600, y: 235 }, '11_E': { x: 650, y: 235 },
    '12_A': { x: 450, y: 270 }, '12_B': { x: 500, y: 270 }, '12_C': { x: 550, y: 270 }, '12_D': { x: 600, y: 270 }, '12_E': { x: 650, y: 270 },
    '13_A': { x: 450, y: 305 }, '13_B': { x: 500, y: 305 }, '13_C': { x: 550, y: 305 }, '13_D': { x: 600, y: 305 }, '13_E': { x: 650, y: 305 },
    '14_A': { x: 450, y: 340 }, '14_B': { x: 500, y: 340 }, '14_C': { x: 550, y: 340 }, '14_D': { x: 600, y: 340 }, '14_E': { x: 650, y: 340 },
    '15_A': { x: 450, y: 375 }, '15_B': { x: 500, y: 375 }, '15_C': { x: 550, y: 375 }, '15_D': { x: 600, y: 375 }, '15_E': { x: 650, y: 375 },
    '16_A': { x: 450, y: 410 }, '16_B': { x: 500, y: 410 }, '16_C': { x: 550, y: 410 }, '16_D': { x: 600, y: 410 }, '16_E': { x: 650, y: 410 },
    '17_A': { x: 450, y: 445 }, '17_B': { x: 500, y: 445 }, '17_C': { x: 550, y: 445 }, '17_D': { x: 600, y: 445 }, '17_E': { x: 650, y: 445 },
    '18_A': { x: 450, y: 480 }, '18_B': { x: 500, y: 480 }, '18_C': { x: 550, y: 480 }, '18_D': { x: 600, y: 480 }, '18_E': { x: 650, y: 480 },
    '19_A': { x: 450, y: 515 }, '19_B': { x: 500, y: 515 }, '19_C': { x: 550, y: 515 }, '19_D': { x: 600, y: 515 }, '19_E': { x: 650, y: 515 },
  }
};