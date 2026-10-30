export interface StrokePoint {
  x: number;
  y: number;
}

export interface AnimeVectorStroke {
  id: number;
  stepNumber: number;
  title: string;
  instructionUz: string;
  tool: 'pencil' | 'brush';
  color: string;
  lineWidth: number;
  points: StrokePoint[];
}

// Generate points for a circle
function generateCirclePoints(cx: number, cy: number, r: number, numPoints = 40): StrokePoint[] {
  const pts: StrokePoint[] = [];
  for (let i = 0; i <= numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2;
    pts.push({
      x: Math.round(cx + r * Math.cos(angle)),
      y: Math.round(cy + r * Math.sin(angle)),
    });
  }
  return pts;
}

// Generate points along a line
function generateLinePoints(x1: number, y1: number, x2: number, y2: number, numPoints = 20): StrokePoint[] {
  const pts: StrokePoint[] = [];
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    pts.push({
      x: Math.round(x1 + t * (x2 - x1)),
      y: Math.round(y1 + t * (y2 - y1)),
    });
  }
  return pts;
}

// Generate points along a quadratic bezier curve
function generateBezierPoints(
  x1: number, y1: number,
  cx: number, cy: number,
  x2: number, y2: number,
  numPoints = 25
): StrokePoint[] {
  const pts: StrokePoint[] = [];
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const inv = 1 - t;
    const x = inv * inv * x1 + 2 * inv * t * cx + t * t * x2;
    const y = inv * inv * y1 + 2 * inv * t * cy + t * t * y2;
    pts.push({ x: Math.round(x), y: Math.round(y) });
  }
  return pts;
}

export const ANIMATED_DEMO_STROKES: AnimeVectorStroke[] = [
  // 1. Head Circle
  {
    id: 1,
    stepNumber: 1,
    title: "1. Bosh Doirasi",
    instructionUz: "1. Endi boshning asosiy doira shaklini chizing.",
    tool: "pencil",
    color: "#06b6d4",
    lineWidth: 3,
    points: generateCirclePoints(400, 230, 110, 45),
  },

  // 2. Vertical Axis Line
  {
    id: 2,
    stepNumber: 2,
    title: "2. Markaziy Liniya",
    instructionUz: "2. Endi yuzning simmetriya yo'nalish chizig'ini chizing.",
    tool: "pencil",
    color: "#06b6d4",
    lineWidth: 2,
    points: generateLinePoints(400, 90, 400, 450, 25),
  },

  // 3. Eye Axis Line
  {
    id: 3,
    stepNumber: 3,
    title: "3. Ko'zlar O'qi",
    instructionUz: "3. Endi ko'zlar balandligini belgilovchi gorizontal chiziqni o'tkazing.",
    tool: "pencil",
    color: "#06b6d4",
    lineWidth: 2,
    points: generateLinePoints(270, 250, 530, 250, 25),
  },

  // 4. Left Jawline
  {
    id: 4,
    stepNumber: 4,
    title: "4. Chap Jag'",
    instructionUz: "4. Endi chap jag' va iyak yo'nalishini shakllantiring.",
    tool: "pencil",
    color: "#a855f7",
    lineWidth: 3,
    points: generateBezierPoints(290, 250, 320, 370, 400, 410, 30),
  },

  // 5. Right Jawline
  {
    id: 5,
    stepNumber: 5,
    title: "5. O'ng Jag'",
    instructionUz: "5. Endi o'ng jag' va iyak uchini birlashtiring.",
    tool: "pencil",
    color: "#a855f7",
    lineWidth: 3,
    points: generateBezierPoints(510, 250, 480, 370, 400, 410, 30),
  },

  // 6. Left Eye Upper Lash
  {
    id: 6,
    stepNumber: 6,
    title: "6. Chap Kiprik Yoyi",
    instructionUz: "6. Endi birinchi (chap) ko'zning qalin yuqori kiprik yoyini chizing.",
    tool: "brush",
    color: "#1e1b4b",
    lineWidth: 5,
    points: generateBezierPoints(320, 245, 345, 230, 375, 245, 25),
  },

  // 7. Left Iris & Pupil
  {
    id: 7,
    stepNumber: 7,
    title: "7. Chap Qorachiq",
    instructionUz: "7. Endi chap ko'z qorachig'i uchun oval shaklni joylashtiring.",
    tool: "brush",
    color: "#ec4899",
    lineWidth: 4,
    points: generateCirclePoints(348, 260, 18, 30),
  },

  // 8. Right Eye Upper Lash
  {
    id: 8,
    stepNumber: 8,
    title: "8. O'ng Kiprik Yoyi",
    instructionUz: "8. Endi ikkinchi (o'ng) ko'zning qalin yuqori kiprik yoyini chizing.",
    tool: "brush",
    color: "#1e1b4b",
    lineWidth: 5,
    points: generateBezierPoints(425, 245, 455, 230, 480, 245, 25),
  },

  // 9. Right Iris & Pupil
  {
    id: 9,
    stepNumber: 9,
    title: "9. O'ng Qorachiq",
    instructionUz: "9. Endi o'ng ko'z qorachig'i ovalini va o'rtadagi nuqtani chizing.",
    tool: "brush",
    color: "#ec4899",
    lineWidth: 4,
    points: generateCirclePoints(452, 260, 18, 30),
  },

  // 10. Eyebrows
  {
    id: 10,
    stepNumber: 10,
    title: "10. Nozik Qoshlar",
    instructionUz: "10. Endi ko'zlar ustidagi elastik nozik qoshlarni chizing.",
    tool: "brush",
    color: "#1e1b4b",
    lineWidth: 3,
    points: [
      ...generateBezierPoints(315, 220, 345, 210, 375, 225, 15),
      ...generateBezierPoints(425, 225, 455, 210, 485, 220, 15),
    ],
  },

  // 11. Nose & Smile
  {
    id: 11,
    stepNumber: 11,
    title: "11. Burun va Tabassum",
    instructionUz: "11. Endi burun nuqtasini hamda shaddod tabassum yoyini joylashtiring.",
    tool: "brush",
    color: "#1e1b4b",
    lineWidth: 3,
    points: [
      ...generateLinePoints(400, 320, 396, 328, 10),
      ...generateBezierPoints(370, 355, 400, 370, 430, 355, 20),
    ],
  },

  // 12. Hair Bangs (Peshana Sochi)
  {
    id: 12,
    stepNumber: 12,
    title: "12. Peshana Sochi (Bangs)",
    instructionUz: "12. Endi peshanaga tushuvchi soch to'plamlarini (Pochka) chizing.",
    tool: "brush",
    color: "#7c3aed",
    lineWidth: 4,
    points: [
      ...generateBezierPoints(400, 110, 370, 180, 330, 210, 20),
      ...generateBezierPoints(400, 110, 410, 190, 400, 220, 20),
      ...generateBezierPoints(400, 110, 440, 180, 470, 210, 20),
    ],
  },

  // 13. Side & Back Hair Volume
  {
    id: 13,
    stepNumber: 13,
    title: "13. Yon va Atrof Sochi",
    instructionUz: "13. Endi bosh atrofidagi havodor va yirik soch hajmini chizing.",
    tool: "brush",
    color: "#7c3aed",
    lineWidth: 5,
    points: [
      ...generateBezierPoints(330, 130, 250, 220, 270, 420, 30),
      ...generateBezierPoints(470, 130, 550, 220, 530, 420, 30),
    ],
  },

  // 14. Neck & Collar
  {
    id: 14,
    stepNumber: 14,
    title: "14. Bo'yin va Yoqa",
    instructionUz: "14. Endi bo'yin chiziqlari hamda maktab formasi yoqasini chizing.",
    tool: "brush",
    color: "#1e1b4b",
    lineWidth: 4,
    points: [
      ...generateLinePoints(360, 390, 350, 470, 15),
      ...generateLinePoints(440, 390, 450, 470, 15),
      ...generateBezierPoints(320, 480, 400, 530, 480, 480, 25),
    ],
  },

  // 15. Eye Highlights & Glow
  {
    id: 15,
    stepNumber: 15,
    title: "15. Ko'z Nuri va Porlash",
    instructionUz: "15. Endi ko'zlarga oq nur nuqtalarini (Highlights) qo'shib, artni yakunlang!",
    tool: "brush",
    color: "#ffffff",
    lineWidth: 4,
    points: [
      ...generateCirclePoints(342, 252, 4, 10),
      ...generateCirclePoints(446, 252, 4, 10),
    ],
  },
];
