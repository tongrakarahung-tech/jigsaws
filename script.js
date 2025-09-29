// script.js

const CONTAINER = document.getElementById('jigsaw-container');
const SHUFFLE_BUTTON = document.getElementById('shuffle-button');
const IMAGE_URL = '851211.jpg'; 

// *** การตั้งค่าจำนวนแถวและคอลัมน์ ***
const ROWS = 6; 
const COLS = 4;
// **********************************

// ขนาดของภาพต้นฉบับ
const TOTAL_WIDTH = 600;
const TOTAL_HEIGHT = 900;

let currentPieces = []; // เก็บ DOM element ของชิ้นส่วน
let selectedPiece = null; // ชิ้นส่วนที่ถูกเลือกชิ้นแรก

// คำนวณขนาดของแต่ละชิ้นส่วน
const PIECE_WIDTH = TOTAL_WIDTH / COLS;
const PIECE_HEIGHT = TOTAL_HEIGHT / ROWS;

// กำหนด grid ใน CSS ด้วย JS ให้สอดคล้องกับ COLS
CONTAINER.style.gridTemplateColumns = `repeat(${COLS}, 1fr)`;

// ฟังก์ชันหลักในการสร้างและจัดเรียงชิ้นส่วน
function createPieces() {
    CONTAINER.innerHTML = ''; // ล้างกระดานเก่า
    currentPieces = [];

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const index = r * COLS + c;

            const piece = document.createElement('div');
            piece.classList.add('piece');
            piece.dataset.correctPos = index; // ตำแหน่งที่ถูกต้อง (0, 1, 2...)
            
            // กำหนดตำแหน่งภาพพื้นหลัง (Background Position)
            const bgX = -c * PIECE_WIDTH;
            const bgY = -r * PIECE_HEIGHT;
            piece.style.backgroundPosition = `${bgX}px ${bgY}px`;

            currentPieces.push(piece);
        }
    }
    
    // รีเซ็ตตัวเลือกและเริ่มสลับ
    selectedPiece = null;
    shufflePieces();
}

// ฟังก์ชันสลับชิ้นส่วน (Fisher-Yates Shuffle Algorithm)
function shufflePieces() {
    // สลับตำแหน่งใน Array
    for (let i = currentPieces.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [currentPieces[i], currentPieces[j]] = [currentPieces[j], currentPieces[i]];
    }
    
    // นำชิ้นส่วนที่สลับแล้วไปใส่ใน container ตามลำดับใหม่
    currentPieces.forEach(piece => CONTAINER.appendChild(piece));
}

// ฟังก์ชันตรวจสอบการชนะ
function checkWin() {
    // ดึง NodeList ของชิ้นส่วนตามลำดับที่แสดงอยู่บนหน้าจอ
    const finalOrder = Array.from(CONTAINER.children); 
    let isCorrect = true;

    for (let i = 0; i < finalOrder.length; i++) {
        // ตรวจสอบว่าลำดับ DOM (i) ตรงกับตำแหน่งที่ถูกต้องที่เก็บไว้ใน data-correct-pos หรือไม่
        if (parseInt(finalOrder[i].dataset.correctPos) !== i) {
            isCorrect = false;
            break;
        }
    }

    if (isCorrect) {
        alert('🎉 ยอดเยี่ยมมาก! ต่อจิ๊กซอว์ 24 ชิ้นเสร็จสมบูรณ์แล้ว!');
    }
}

// ฟังก์ชันสลับชิ้นส่วนที่เลือก
function swapPieces(pieceA, pieceB) {
    // ใช้ Node.insertBefore เพื่อสลับตำแหน่งใน DOM
    const parent = pieceA.parentNode;
    
    // หาตำแหน่งถัดไปของ B
    const nextSiblingB = pieceB.nextSibling;
    
    // สลับตำแหน่ง
    parent.insertBefore(pieceB, pieceA);
    parent.insertBefore(pieceA, nextSiblingB);
}

// ******* Event Listeners *******

// 1. จัดการการคลิกที่กระดานเพื่อสลับชิ้นส่วน
CONTAINER.addEventListener('click', (event) => {
    const clickedPiece = event.target;
    // ตรวจสอบว่าคลิกถูกชิ้นส่วนจิ๊กซอว์จริงๆ
    if (!clickedPiece.classList.contains('piece')) return; 

    if (selectedPiece === null) {
        // 1. เลือกชิ้นแรก
        selectedPiece = clickedPiece;
        selectedPiece.classList.add('selected');
    } else if (selectedPiece === clickedPiece) {
        // 2. ยกเลิกการเลือกชิ้นเดิม
        selectedPiece.classList.remove('selected');
        selectedPiece = null;
    } else {
        // 3. เลือกชิ้นที่สอง -> สลับ
        swapPieces(selectedPiece, clickedPiece);
        selectedPiece.classList.remove('selected'); // เอาไฮไลท์ออก
        selectedPiece = null; // รีเซ็ตตัวเลือก
        checkWin(); // ตรวจสอบการชนะหลังสลับ
    }
});

// 2. ปุ่มเริ่มเกม/สลับชิ้นส่วน
SHUFFLE_BUTTON.addEventListener('click', createPieces);

// เริ่มเกมครั้งแรกเมื่อโหลดหน้า
createPieces();