import stage1Const from '../assets/images/stage1_construction_1793379154258.jpg';
import stage2Rough from '../assets/images/stage2_rough_sketch_1793379154150.jpg';
import stage3Lineart from '../assets/images/stage3_clean_lineart_1793379154396.jpg';
import stage4Colors from '../assets/images/stage4_base_colors_1793379155476.jpg';
import stage5Shading from '../assets/images/stage5_shading_1793379171103.jpg';
import stage6Final from '../assets/images/stage6_final_1793379172114.jpg';

export interface WorkflowStage {
  stageNumber: number;
  stageName: string;
  stageTitle: string;
  artistAction: string;
  instructions: string;
  tips: string[];
  referenceImage: string;
  recommendedTool: 'pencil' | 'brush' | 'eraser';
  recommendedColor: string;
  recommendedSize: number;
  encouragementMsg: string;
}

export interface CharacterWorkflowLesson {
  id: string;
  title: string;
  characterType: string;
  description: string;
  stages: WorkflowStage[];
}

export const PROFESSIONAL_WORKFLOWS: CharacterWorkflowLesson[] = [
  {
    id: "wf-anime-girl",
    title: "Anime Qiz Xarakterini Bosqichma-Bosqich Yaratish",
    characterType: "Anime Qiz (Sakura)",
    description: "Haqiqiy anime illustratorlari kabi noldan boshlab to'liq xarakter artini 6 ta professional bosqichda yaratish.",
    stages: [
      {
        stageNumber: 1,
        stageName: "1. Konstruksiya",
        stageTitle: "STAGE 1 — Konstruksiya va Asos",
        artistAction: "Professional rassomlar ishni oddiy doira, o'q chiziqlari va tana karkasidan boshlaydi.",
        instructions: "Ekranda ko'ringan havo rang doira hamda vertikal/gorizontal o'q chiziqlarini qalamingiz bilan chizib oling.",
        tips: [
          "Chiziqlarni yengil va mayin torting",
          "Doira yuz balandligini, gorizontal liniya ko'zlar o'rnini belgilaydi"
        ],
        referenceImage: stage1Const,
        recommendedTool: "pencil",
        recommendedColor: "#06b6d4",
        recommendedSize: 2,
        encouragementMsg: "Ajoyib! Birinchi konstruksiya karkasi to'g'ri yo'lga qo'yildi."
      },
      {
        stageNumber: 2,
        stageName: "2. Eskiz",
        stageTitle: "STAGE 2 — Dastlabki Eskiz (Rough Sketch)",
        artistAction: "Konstruksiya ustidan ko'zlar, qoshlar, burun, og'iz hamda soch va kiyim formasini eskiz qilib joylashtirish.",
        instructions: "Chizilgan konstruksiyangiz ustidan xarakter yuzi, ko'zlari va sochi konturlarini yengil qalam bilan eskiz qiling.",
        tips: [
          "Oldingi chiziqlarni o'chirish shart emas, ustidan chiza bering",
          "Sochni alohida tola emas, guruh shaklida ko'ring"
        ],
        referenceImage: stage2Rough,
        recommendedTool: "pencil",
        recommendedColor: "#a855f7",
        recommendedSize: 3,
        encouragementMsg: "Zo'r! Xarakter shakli va qiyofasi aniq ko'rina boshladi."
      },
      {
        stageNumber: 3,
        stageName: "3. Kontur (Lineart)",
        stageTitle: "STAGE 3 — Toza Kontur Liniyasi (Clean Lineart)",
        artistAction: "Eskiz ustidan toza, ravshan va qat'iy kontur chiziqlarini o'tkazish hamda keraksiz xom chiziqlarni o'chirish.",
        instructions: "To'q mo'hqalam yoki qalam bilan ko'zlar, soch va kiyimning aniq konturini chazing. Keraksiz eskiz chiziqlarini o'chirg'ich bilan tozalang.",
        tips: [
          "Chiziqlar uchrashgan joyini biroz qalinroq qiling",
          "Lineart toza bo'lsa, rang berish juda oson kechadi"
        ],
        referenceImage: stage3Lineart,
        recommendedTool: "brush",
        recommendedColor: "#1e1b4b",
        recommendedSize: 4,
        encouragementMsg: "Qoyilnoma! Konturingiz xuddi manga sahifasidagidek toza va ravshan."
      },
      {
        stageNumber: 4,
        stageName: "4. Ranglar",
        stageTitle: "STAGE 4 — Asosiy Ranglar (Base Colors)",
        artistAction: "Teri, soch, ko'z va kiyim uchun tekis (flat) asosiy ranglarni berish.",
        instructions: "Tekis mo'hqalam bilan xarakteringiz terisiga och nimrang, sochiga binafsha va kiyimiga to'q ko'k rang bering.",
        tips: [
          "Dastlab o'ta to'q rang ishlatmang, tekis va yorqin rang tanlang"
        ],
        referenceImage: stage4Colors,
        recommendedTool: "brush",
        recommendedColor: "#7c3aed",
        recommendedSize: 12,
        encouragementMsg: "Ranglar mosligi juda chiroyli va jonli chiqmoqda!"
      },
      {
        stageNumber: 5,
        stageName: "5. Soya va Nur",
        stageTitle: "STAGE 5 — Soya va Yorug'lik (Shading & Highlights)",
        artistAction: "Yuz osti, soch va kiyim burmalariga soyalar va hajm nurini qo'shish.",
        instructions: "Iyak ostiga, soch burmalariga to'qroq soya hamda soch ustiga va ko'zlarga yorqin oq nur nuqtalarini qo'shing.",
        tips: [
          "Nur tushayotgan qarama-qarshi tomondan soya bering",
          "Ko'z nurli nuqtalari artni 3D ko'rinishga keltirib beradi"
        ],
        referenceImage: stage5Shading,
        recommendedTool: "brush",
        recommendedColor: "#4c1d95",
        recommendedSize: 8,
        encouragementMsg: "Hajm va chuqurlik paydo bo'ldi! Illustration 3D darajaga ko'tarildi."
      },
      {
        stageNumber: 6,
        stageName: "6. Yakuniy Art",
        stageTitle: "STAGE 6 — Yakuniy Detallar va Art (Final Artwork)",
        artistAction: "So'nggi yorqin effektlar, porlash va fon elementlarini yakunlash.",
        instructions: "Soch va ko'zlarga neon porlash effektini qo'shib, yakuniy tayyor illyustratsiyangizni Portfolioga saqlang!",
        tips: [
          "O'z nomingiz va imzongizni art burchagiga qo'yishni unutmang!"
        ],
        referenceImage: stage6Final,
        recommendedTool: "brush",
        recommendedColor: "#ffffff",
        recommendedSize: 3,
        encouragementMsg: "Tabriklaymiz! Siz haqiqiy professional anime artist kabi noldan to'liq xarakter yaratdingiz!"
      }
    ]
  }
];
