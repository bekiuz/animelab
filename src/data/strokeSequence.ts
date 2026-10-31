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

function line(x1: number, y1: number, x2: number, y2: number, count = 18): StrokePoint[] {
  return Array.from({ length: count + 1 }, (_, i) => {
    const t = i / count;
    return { x: Math.round(x1 + (x2 - x1) * t), y: Math.round(y1 + (y2 - y1) * t) };
  });
}

function curve(x1: number, y1: number, cx: number, cy: number, x2: number, y2: number, count = 28): StrokePoint[] {
  return Array.from({ length: count + 1 }, (_, i) => {
    const t = i / count;
    const inv = 1 - t;
    return {
      x: Math.round(inv * inv * x1 + 2 * inv * t * cx + t * t * x2),
      y: Math.round(inv * inv * y1 + 2 * inv * t * cy + t * t * y2),
    };
  });
}

function ellipse(cx: number, cy: number, rx: number, ry: number, count = 48): StrokePoint[] {
  return Array.from({ length: count + 1 }, (_, i) => {
    const angle = (i / count) * Math.PI * 2;
    return { x: Math.round(cx + rx * Math.cos(angle)), y: Math.round(cy + ry * Math.sin(angle)) };
  });
}

const strokes: AnimeVectorStroke[] = [];
function add(title: string, instructionUz: string, points: StrokePoint[], color = '#64748b', lineWidth = 2.5, tool: 'pencil' | 'brush' = 'pencil') {
  const id = strokes.length + 1;
  strokes.push({ id, stepNumber: id, title, instructionUz, points, color, lineWidth, tool });
}

// Konstruksiya: rassom avval bosh va yuz proporsiyalarini belgilaydi.
add('Boshning asosiy shakli', 'Yengil qalam bilan bosh uchun katta oval chizing. Hozircha chiziqlarni qattiq bosmang.', ellipse(400, 238, 112, 137, 64), '#38bdf8', 2);
add('Yuzning markaziy o‘qi', 'Oval markazidan iyakkacha yengil vertikal yo‘nalish chizig‘ini tushiring.', curve(400, 95, 405, 245, 400, 405, 32), '#38bdf8', 2);
add('Ko‘zlar yo‘nalishi', 'Yuzning o‘rtasidan ko‘zlar joylashadigan gorizontal chiziq torting.', line(286, 246, 514, 246, 28), '#38bdf8', 2);
add('Jag‘ning chap tomoni', 'Ovalning chap chetidan boshlang va chiziqni iyak tomon yumshoq egib olib boring.', curve(291, 220, 294, 345, 400, 402, 34), '#a78bfa', 3);
add('Jag‘ning o‘ng tomoni', 'Ikkinchi tomonni chizing va ikki chiziqni iyakda birlashtiring.', curve(509, 220, 506, 345, 400, 402, 34), '#a78bfa', 3);
add('Chap quloq', 'Yuzning chap chetiga quloq shaklini chizing. U ko‘z va burun oralig‘iga yaqin joylashadi.', curve(294, 250, 264, 242, 274, 302, 24), '#a78bfa', 2.5);
add('O‘ng quloq', 'Ikkinchi quloqni yuzning o‘ng tomoniga, birinchisiga mos balandlikda chizing.', curve(506, 250, 536, 242, 526, 302, 24), '#a78bfa', 2.5);

// Ko‘zlar: avval qovoqlar, keyin iris va qorachiqlar.
add('Chap ko‘zning yuqori qovog‘i', 'Chap ko‘z uchun yuqoriga ko‘tarilgan yoy chizing. Anime ko‘zining ifodasi shu chiziqdan boshlanadi.', curve(310, 258, 345, 224, 384, 258, 30), '#312e81', 4, 'brush');
add('Chap ko‘zning pastki qovog‘i', 'Yuqori yoyning ikki uchini pastdan yumshoq egri chiziq bilan ulang.', curve(310, 258, 347, 292, 384, 258, 30), '#312e81', 2.5);
add('O‘ng ko‘zning yuqori qovog‘i', 'Endi o‘ng ko‘zning yuqori yoyini chizing. Ikki ko‘z bir xil balandlikda bo‘lsin.', curve(416, 258, 455, 224, 490, 258, 30), '#312e81', 4, 'brush');
add('O‘ng ko‘zning pastki qovog‘i', 'O‘ng ko‘zning pastki qismini yumshoq egri chiziq bilan yoping.', curve(416, 258, 453, 292, 490, 258, 30), '#312e81', 2.5);
add('Chap ko‘z qorachig‘i', 'Chap ko‘z ichiga vertikal oval iris chizing. Yuqori qismi kiprik ostida qolishi mumkin.', ellipse(350, 260, 17, 22, 32), '#a855f7', 3, 'brush');
add('O‘ng ko‘z qorachig‘i', 'Ikkinchi ko‘z ichiga ham mos oval chizing.', ellipse(450, 260, 17, 22, 32), '#a855f7', 3, 'brush');
add('Chap ko‘z markazi', 'Iris ichiga kichikroq qoramtir oval chizing.', ellipse(350, 263, 8, 13, 24), '#1e1b4b', 3, 'brush');
add('O‘ng ko‘z markazi', 'Ikkinchi ko‘z qorachig‘ini ham to‘ldiring.', ellipse(450, 263, 8, 13, 24), '#1e1b4b', 3, 'brush');

// Yuz ifodasi: qoshlar, burun, og‘iz va quloq detallari.
add('Chap qosh', 'Chap ko‘z ustida yengil egilgan qosh chizing. Qosh ko‘zga juda yaqin bo‘lmasin.', curve(314, 218, 346, 202, 382, 218, 24), '#312e81', 3, 'brush');
add('O‘ng qosh', 'Ikkinchi qoshni birinchisiga mos balandlikda chizing.', curve(418, 218, 454, 202, 486, 218, 24), '#312e81', 3, 'brush');
add('Burun', 'Yuz markazida qisqa, nozik burun chizig‘ini chizing.', curve(400, 285, 394, 300, 400, 307, 12), '#64748b', 2);
add('Og‘izning yuqori chizig‘i', 'Burun ostidan tabassumning yuqori egri chizig‘ini chizing.', curve(373, 337, 400, 347, 427, 337, 20), '#be185d', 2.5, 'brush');
add('Og‘izning pastki chizig‘i', 'Tabassumning pastki qismini kichik egri chiziq bilan tugating.', curve(378, 340, 400, 358, 422, 340, 20), '#be185d', 2, 'brush');
add('Chap quloq ichki chizig‘i', 'Quloq ichiga bitta mayin egri chiziq qo‘shing.', curve(282, 270, 293, 278, 286, 294, 14), '#a78bfa', 2);
add('O‘ng quloq ichki chizig‘i', 'Ikkinchi quloq ichiga ham shu kabi mayin chiziq qo‘shing.', curve(518, 270, 507, 278, 514, 294, 14), '#a78bfa', 2);

// Soch: avval katta tashqi shakl, keyin peshana tutamlari va yon sochlar.
add('Sochning chap yuqori konturi', 'Peshana ustidan sochning katta hajmini chap tomondan bosh tepasiga qarab chizing.', curve(300, 194, 270, 78, 400, 74, 38), '#4c1d95', 5, 'brush');
add('Sochning o‘ng yuqori konturi', 'Bosh tepasidagi soch konturini o‘ng tomonga davom ettiring.', curve(400, 74, 532, 78, 500, 194, 38), '#4c1d95', 5, 'brush');
add('Chap peshana sochi', 'Birinchi soch tutamini chapdan peshanaga qarab tushiring. Uchiga kelganda chiziqni egib boring.', curve(326, 118, 316, 178, 365, 222, 30), '#6d28d9', 4, 'brush');
add('Markaziy peshana sochi', 'O‘rtadan tushadigan soch tutamini chizing. U yuzning yuqori qismiga yengil tushsin.', curve(386, 88, 390, 158, 400, 219, 30), '#6d28d9', 4, 'brush');
add('O‘ng peshana sochi', 'O‘ng tomondagi tutamni markazga qarab egib chizing.', curve(466, 118, 484, 178, 437, 222, 30), '#6d28d9', 4, 'brush');
add('Chap yon soch tashqi konturi', 'Chap tomonda sochni quloq yonidan pastga, yelka tomonga tushiring.', curve(302, 160, 245, 224, 267, 365, 36), '#4c1d95', 5, 'brush');
add('Chap yon soch ichki tutami', 'Chap soch ichiga ikkinchi tutam chizing. U yuz konturini biroz qoplab turishi mumkin.', curve(316, 190, 282, 282, 308, 394, 32), '#7c3aed', 3.5, 'brush');
add('O‘ng yon soch tashqi konturi', 'O‘ng tomonda uzun soch konturini yelka tomon tushiring.', curve(498, 160, 555, 224, 533, 365, 36), '#4c1d95', 5, 'brush');
add('O‘ng yon soch ichki tutami', 'O‘ng soch ichiga yana bir mayin tutam chizing.', curve(484, 190, 518, 282, 492, 394, 32), '#7c3aed', 3.5, 'brush');
add('Sochning chap uchi', 'Chap tomondagi soch uchini yumshoq egri chiziq bilan yakunlang.', curve(268, 365, 276, 410, 310, 424, 22), '#4c1d95', 3, 'brush');
add('Sochning o‘ng uchi', 'Ikkinchi tomondagi soch uchini ham chizing.', curve(532, 365, 524, 410, 490, 424, 22), '#4c1d95', 3, 'brush');

// Bo‘yin, yelka va kiyim.
add('Bo‘yinning chap konturi', 'Iyak ostidan pastga bo‘yinning chap konturini chizing.', line(365, 385, 357, 458, 18), '#312e81', 3);
add('Bo‘yinning o‘ng konturi', 'Bo‘yinning ikkinchi konturini chizing.', line(435, 385, 443, 458, 18), '#312e81', 3);
add('Chap yelka', 'Bo‘yin tagidan chap yelka tomonga egri chiziq torting.', curve(357, 446, 305, 450, 258, 518, 28), '#312e81', 4, 'brush');
add('O‘ng yelka', 'Ikkinchi yelkani shu shaklga mos ravishda chizing.', curve(443, 446, 495, 450, 542, 518, 28), '#312e81', 4, 'brush');
add('Ko‘ylak yoqasining chap tomoni', 'Bo‘yin tagidan ko‘ylak yoqasining chap uchini chizing.', curve(358, 444, 365, 474, 390, 493, 22), '#64748b', 3);
add('Ko‘ylak yoqasining o‘ng tomoni', 'Yoqaning ikkinchi tomonini markazda birlashtiring.', curve(442, 444, 435, 474, 410, 493, 22), '#64748b', 3);
add('Ko‘ylak markaziy chizig‘i', 'Kiyimning old qismida pastga tushuvchi markaziy chiziq qo‘shing.', line(400, 493, 400, 548, 16), '#64748b', 2.5);
add('Yoqa bezagi', 'Yoqaning markaziga kichik bezak yoki galstuk shaklini chizing.', curve(385, 493, 400, 518, 415, 493, 18), '#a855f7', 3, 'brush');

// Yakuniy detallar: soch tolalari, ko‘z yaltirashi va yumshoq soya.
add('Chap soch yaltirashi', 'Soch ustiga yorug‘lik tushgan joyni ko‘rsatish uchun nozik och rangli chiziq torting.', curve(326, 106, 348, 84, 375, 92, 22), '#c4b5fd', 3, 'brush');
add('O‘ng soch yaltirashi', 'Ikkinchi tomonga ham qisqa yorug‘lik chizig‘ini qo‘shing.', curve(425, 91, 455, 82, 475, 108, 22), '#c4b5fd', 3, 'brush');
add('Chap ko‘zdagi nur', 'Chap ko‘z ichiga kichik oq yaltirash nuqtasini chizing.', ellipse(343, 253, 4, 6, 16), '#ffffff', 3, 'brush');
add('O‘ng ko‘zdagi nur', 'Ikkinchi ko‘zga ham nur nuqtasini qo‘shing.', ellipse(443, 253, 4, 6, 16), '#ffffff', 3, 'brush');
add('Iyak ostidagi soya', 'Iyak ostiga juda yengil egri soya chizing. Bu yuzga hajm beradi.', curve(358, 388, 400, 410, 442, 388, 22), '#a78bfa', 2, 'brush');
add('Yakuniy soch tolasi', 'Soch ichiga oxirgi mayin chiziqni qo‘shing. Namoyish tugagach, rasmni o‘zingiz ham takrorlab chizing.', curve(290, 223, 276, 280, 292, 337, 26), '#c4b5fd', 2, 'brush');

export const ANIMATED_DEMO_STROKES: AnimeVectorStroke[] = strokes;
