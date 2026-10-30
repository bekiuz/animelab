import { Course, Competition, Artwork, PracticeTutorial, MentorshipRequest } from '../types';

import heroArt from '../assets/images/hero_anime_art_1793378144031.jpg';
import courseFaceEyes from '../assets/images/course_face_eyes_1793378142727.jpg';
import courseDynamicBoy from '../assets/images/course_dynamic_boy_1793378272015.jpg';
import courseDigitalArt from '../assets/images/course_digital_art_1793378143734.jpg';
import courseOutfits from '../assets/images/course_outfits_1793378290812.jpg';
import courseSceneryGirl from '../assets/images/course_scenery_girl_1793378292251.jpg';
import compAutumnGirl from '../assets/images/competition_autumn_girl_1793378291864.jpg';
import compCyberBoy from '../assets/images/competition_cyber_boy_1793378292796.jpg';
import avatarGirl from '../assets/images/avatar_anime_girl_1793378312306.jpg';
import avatarBoy from '../assets/images/avatar_anime_boy_1793378313672.jpg';

export const HERO_ART_IMAGE = heroArt;
export const DEFAULT_ANIME_GIRL_AVATAR = avatarGirl;
export const DEFAULT_ANIME_BOY_AVATAR = avatarBoy;

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-1',
    title: 'Anime Yuz va Bosh Anatomiyasi Grundi',
    description: "Anime va manga uslubida erkak va ayol yuzlarini har xil burchaklardan (Frontal, Profile, 3/4) to'g'ri chizish sirlari va nisbatlar.",
    category: 'Yuz va Sochlar',
    difficulty: "Boshlang'ich",
    instructor: 'Akira Saydo (Senior Anime Artist)',
    thumbnail: courseFaceEyes,
    duration: '2 soat 45 min',
    lessonsCount: 6,
    rating: 4.9,
    enrolledCount: 1420,
    isPublished: true,
    createdAt: '2026-01-15',
  },
  {
    id: 'course-2',
    title: 'Dinamik Anime Pozalari va Tana Anatomiyasi',
    description: "Harakatdagi qahramonlar, jangovar pozalar, tana nisbatlari (8-bosh qoidasi) va burchak ko'rinishlarini (perspective) chizish.",
    category: 'Anatomiya',
    difficulty: "O'rta",
    instructor: 'Jasur Maxkamov (Manga Illustrator)',
    thumbnail: courseDynamicBoy,
    duration: '3 soat 20 min',
    lessonsCount: 8,
    rating: 4.8,
    enrolledCount: 980,
    isPublished: true,
    createdAt: '2026-02-01',
  },
  {
    id: 'course-3',
    title: "Anime Sochlar va Ekspressiv Ko'zlar",
    description: "Yorug'lik effektlari, soch tolalari harakati, nur qaytishi va tuyg'ularni (quvonch, g'azab, g'am) ko'zlarda aks ettirish usullari.",
    category: 'Yuz va Sochlar',
    difficulty: "Boshlang'ich",
    instructor: 'Miyuki Tashkent (Character Designer)',
    thumbnail: courseFaceEyes,
    duration: '1 soat 50 min',
    lessonsCount: 5,
    rating: 5.0,
    enrolledCount: 2150,
    isPublished: true,
    createdAt: '2026-02-10',
  },
  {
    id: 'course-4',
    title: 'Raqamli Art: Clip Studio & Photoshop Masterclass',
    description: "Lineart, tekis rang berish (Flat coloring), gradientlar, soya va nur qatlamlari (Shading & Highlights) bilan professional anime art yaratish.",
    category: 'Raqamli Art',
    difficulty: "O'rta",
    instructor: 'Diyorbek AnimeLab Master',
    thumbnail: courseDigitalArt,
    duration: '4 soat 10 min',
    lessonsCount: 10,
    rating: 4.9,
    enrolledCount: 1730,
    isPublished: true,
    createdAt: '2026-03-05',
  },
  {
    id: 'course-5',
    title: 'Kiyim-kechak Burmalari va Matolar Teksturasi',
    description: "Manga va anime xarakterlari kiyimlarini realizm bilan chizish: maktab formasi, kimono, ko'cha modasi va zirhlardagi burmalar gipotezasi.",
    category: 'Kiyim-kechak',
    difficulty: "O'rta",
    instructor: 'Sardor Arts (Concept Artist)',
    thumbnail: courseOutfits,
    duration: '2 soat 15 min',
    lessonsCount: 6,
    rating: 4.7,
    enrolledCount: 640,
    isPublished: true,
    createdAt: '2026-03-20',
  },
  {
    id: 'course-6',
    title: 'Anime Manzara va Fon Kompozitsiyasi',
    description: "Kuzgi yapon ko'chalari, fantastik osmon, bulutlar va perspektiva qoidalari bo'yicha mukammal fon (Background) yaratish.",
    category: 'Kompozitsiya',
    difficulty: 'Yuqori',
    instructor: 'Kenshin Uz (Environment Conceptor)',
    thumbnail: courseSceneryGirl,
    duration: '3 soat 50 min',
    lessonsCount: 9,
    rating: 4.9,
    enrolledCount: 810,
    isPublished: true,
    createdAt: '2026-04-01',
  },
];

export const INITIAL_LESSONS_MAP: Record<string, any[]> = {
  'course-1': [
    {
      id: 'c1-l1',
      courseId: 'course-1',
      title: '1-dars: Doira va Yuz Qolipi (Loomis usuli)',
      duration: '18 min',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      content: "Ushbu darsda doira chizish, markaziy chiziq va yuz qoliplarini belgilashni o'rganasiz. Loomis va Anime uslubining gibrid qoidasi qo'llaniladi.",
      steps: [
        { stepNumber: 1, title: 'Bosh doirasini chizish', description: "Yumshoq doira chizib, uning o'rtasidan vertikal va gorizontal o'q chiziqlarini o'tkazing." },
        { stepNumber: 2, title: "Jag' chizig'i va iyak", description: 'Gorizontal chiziqdan pastga qarab pastki iyak burchaklarini bir xil nisbatda hosil qiling.' },
        { stepNumber: 3, title: "Ko'z o'qi va burun o'rni", description: 'Doiraning pastki chegarasida burun nuqtasini markazlashtiring.' }
      ],
      order: 1,
      isFree: true,
      createdAt: '2026-01-15',
    },
    {
      id: 'c1-l2',
      courseId: 'course-1',
      title: "2-dars: Frontal (Old) ko'rinishda ko'z va burun joylashuvi",
      duration: '22 min',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      content: "Ko'zlar orasidagi masofa aynan bitta ko'z kengligiga teng bo'lishi kerak. Eron, yapon va shoujo uslubidagi ko'z turlarini solishtiramiz.",
      steps: [
        { stepNumber: 1, title: "Ko'z kataklarini belgilash", description: '3 ta teng katak ajratib oling.' },
        { stepNumber: 2, title: 'Yuqori kiprik konturi', description: 'Qalin va elastik chiziq bilan yuqori kiprik yoyini chizing.' }
      ],
      order: 2,
      isFree: true,
      createdAt: '2026-01-16',
    },
    {
      id: 'c1-l3',
      courseId: 'course-1',
      title: '3-dars: 3/4 Yonlama burchak va chuqurlik hissiyoti',
      duration: '25 min',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      content: "3/4 burchak anime illyustratsiyasida eng mashhur hisoblanadi. Uzoqdagi ko'zning qisqarishi (foreshortening) sirini o'rganing.",
      order: 3,
      isFree: false,
      createdAt: '2026-01-17',
    },
    {
      id: 'c1-l4',
      courseId: 'course-1',
      title: '4-dars: Oqshom va Profildan (Yon tomondan) chizish',
      duration: '20 min',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      content: "Yon ko'rinishda lablar, iyak va burunning to'g'ri egri chiziqlarini chizish mashqi.",
      order: 4,
      isFree: false,
      createdAt: '2026-01-18',
    }
  ]
};

export const INITIAL_PRACTICE_TUTORIALS: PracticeTutorial[] = [
  {
    id: 'prac-1',
    title: "Classic Anime Ko'zlarini Chizish",
    category: 'Yuz va Sochlar',
    difficulty: "Boshlang'ich",
    thumbnail: courseFaceEyes,
    description: "Aka-dada uslubidagi nur va jozibaga boy anime ko'zini 5 ta bosqichda chizib ko'ring.",
    steps: [
      {
        number: 1,
        title: 'Asosiy shakl va Kiprik konturi',
        description: "Yuqori kiprik yoyini qalinroq va pastki kiprik chizig'ini yengil chizib oling.",
        overlayImage: courseFaceEyes,
        tips: ["Pastki kiprikni o'ta yaqin qilmang", "Kiprik uchlarini o'tkir shakllantiring"]
      },
      {
        number: 2,
        title: 'Qorachiq (Pupil) va Shakllar',
        description: "Ko'z qorachig'i uchun oval shaklni joylashtiring va o'rtadagi markaz nuqtani belgilang.",
        overlayImage: courseFaceEyes,
        tips: ["Ko'z qorachig'ini vertikalroq chizing", "Nur tushish nuqtasini oldindan doira qilib ajrating"]
      },
      {
        number: 3,
        title: 'Birlamchi Soya va Nur Manbalari',
        description: "Yuqori qismini to'qiroq, pastki qismini ochroq rang bilan to'ldiring.",
        overlayImage: courseFaceEyes,
        tips: ["Highlight (Nur) doirasi ustidan chiziq o'tkazmang"]
      },
      {
        number: 4,
        title: 'Detallar va Nur Porlashi (Glow)',
        description: "Neon tuyg'usini berish uchun oq va yorqin rangli porlash effektlarini qo'shing.",
        overlayImage: courseFaceEyes,
        tips: ["Oq nuqtalar orqali jonli nigoh hosil qiling"]
      }
    ]
  },
  {
    id: 'prac-2',
    title: 'Anime Soch Oqimini Shakllantirish',
    category: 'Yuz va Sochlar',
    difficulty: "Boshlang'ich",
    thumbnail: courseSceneryGirl,
    description: "Alohida tola bilan emas, balki guruhlangan 'Pochka' (Hair Clumps) bilan tabiiy va havodor soch chizish mashqi.",
    steps: [
      {
        number: 1,
        title: 'Bosh suyagi va Soch ildizi chegarasi',
        description: "Bosh xaritasini tayyorlab, soch ildizlari chiqadigan markaziy nuqtani belgisi qo'ying.",
        overlayImage: courseSceneryGirl,
        tips: ["Soch bosh suyagidan balandroq bo'lishi lozim"]
      },
      {
        number: 2,
        title: 'Pochka (Bang & Ribbon) chiziqlari',
        description: "Yuz oldidagi va yon atrofdagi asosiy soch bog'lamlarini yirik qilib chizing.",
        overlayImage: courseOutfits,
        tips: ["Barcha sochlar bir tomonga ma'lum dinamika bilan oqsin"]
      }
    ]
  },
  {
    id: 'prac-3',
    title: 'Chibi Xarakter va Shaddod Pozalar',
    category: 'Anatomiya',
    difficulty: "Boshlang'ich",
    thumbnail: courseDynamicBoy,
    description: '2 va 3 bosh balandligidagi shirin chibi uslubidagi yoqimtoy personaj yaratish uslubi.',
    steps: [
      {
        number: 1,
        title: 'Bosh va Tana balandligi (1:1 nisbat)',
        description: 'Chibi xarakterda bosh va tana nisbati teng 1 ga 1 qilib olinadi.',
        overlayImage: courseDynamicBoy,
        tips: ["Qo'l va oyoqlar doiracha ko'rinishida yumshoq chiziladi"]
      }
    ]
  }
];

export const INITIAL_COMPETITIONS: Competition[] = [
  {
    id: 'comp-1',
    title: 'Kuzgi Anime Qahramoni 2026',
    description: "Kuz fasli ruhiyati, xazonlar, issiq sharf va shinam atmosferadagi o'z original anime xarakteringizni yaratib tanlovda g'olib bo'ling!",
    theme: 'Kuz ruhi va Shinamlik',
    prize: "1-o'rin: HUION Kamvas Pro 13 Planchet + AnimeLab Gold Sertifikat | 2-o'rin: Graphic Tablet XP-Pen | 3-o'rin: 1 Yillik VIP A'zolik",
    startDate: '2026-10-01',
    endDate: '2026-11-20',
    rules: [
      "Asar muallifi shaxsan o'zingiz bo'lishingiz shart (Sun'iy intellekt AI man etiladi).",
      "Format: PNG/JPEG, Minimum resolution 2000x2000px.",
      "Kamida 2 ta bosqichli eskiz jarayoni skrinshotini taqdim etish tavsiya etiladi."
    ],
    coverImage: compAutumnGirl,
    status: 'active',
    entriesCount: 47,
    createdAt: '2026-10-01'
  },
  {
    id: 'comp-2',
    title: 'Cyberpunk Tashkent 3000',
    description: "Toshkent shahrining kelajakdagi kiberpank va sci-fi anime uslubidagi ko'rinishini yoki kiber-qahramonini chizing.",
    theme: "Futuristik Cyberpunk & O'zbekiston",
    prize: "Wacom Intuos Medium + Mentorlik Seansi + AnimeLab Maxsus Sovrinlar",
    startDate: '2026-12-01',
    endDate: '2026-12-30',
    rules: [
      "Anime/Manga uslubiga rioya qiling.",
      "O'zbek milliy yoki zamonaviy Toshkent elementlari aks etishi katta plyus beradi."
    ],
    coverImage: compCyberBoy,
    status: 'upcoming',
    entriesCount: 0,
    createdAt: '2026-10-25'
  }
];

export const INITIAL_ARTWORKS: Artwork[] = [
  {
    id: 'art-1',
    title: 'Kuzgi Sharf kiygan Qiz',
    description: "AnimeLab 'Kuzgi Anime Qahramoni' tanlovi uchun ishlangan raqamli art. Photoshop va Clip Studio Paint platformalarida 6 soat vaqt ketdi.",
    imageUrl: compAutumnGirl,
    authorId: 'user-art-1',
    authorName: 'Madina Art',
    authorAvatar: avatarGirl,
    category: 'Digital Art',
    likesCount: 128,
    likes: ['user-1', 'user-2'],
    viewsCount: 890,
    isFeatured: true,
    competitionId: 'comp-1',
    createdAt: '2026-10-15'
  },
  {
    id: 'art-2',
    title: 'Samuray Qilichboz Ninja',
    description: "Qora va binafsha rangli neon nur effektlari bilan tayyorlangan dinamik manga posteri.",
    imageUrl: courseDynamicBoy,
    authorId: 'user-art-2',
    authorName: 'Sardor Manga',
    authorAvatar: avatarBoy,
    category: 'Anatomiya',
    likesCount: 94,
    likes: ['user-1'],
    viewsCount: 520,
    isFeatured: true,
    createdAt: '2026-10-18'
  },
  {
    id: 'art-3',
    title: 'Sehrli Osmon va Sakurakor',
    description: "Kuzgi va bahoriy o'rtasidagi hayoliy anime manzara mashqi.",
    imageUrl: courseSceneryGirl,
    authorId: 'user-art-3',
    authorName: 'Aziza Illustrates',
    authorAvatar: avatarGirl,
    category: 'Kompozitsiya',
    likesCount: 210,
    likes: ['user-3', 'user-4'],
    viewsCount: 1400,
    isFeatured: true,
    createdAt: '2026-10-22'
  },
  {
    id: 'art-4',
    title: 'Cyber-Girl 2099 Concept',
    description: 'Kelajak vizualizatsiyasi va neon sochlar mashqi.',
    imageUrl: compCyberBoy,
    authorId: 'user-art-4',
    authorName: 'Timur Neon',
    authorAvatar: avatarBoy,
    category: 'Raqamli Art',
    likesCount: 175,
    likes: [],
    viewsCount: 980,
    isFeatured: false,
    createdAt: '2026-10-24'
  }
];

export const INITIAL_MENTOR_REQUESTS: MentorshipRequest[] = [
  {
    id: 'mr-1',
    userId: 'user-student-1',
    userName: 'Bekzod Xasanov',
    userAvatar: avatarBoy,
    artworkUrl: courseDynamicBoy,
    title: 'Samuray elkasidagi soya va chiziqlar tahlili',
    description: "Salom mentorlar! Qo'ldagi qilich va kiyimdagi burmalar tabiiy chiqdimi? Yelka nisbati biroz g'alati tuyulayapti.",
    status: 'reviewed',
    feedback: "Assalomu alaykum Bekzod! Chizgilar va liniyalar juda shaddod. Yelka qismida trapeziya mushagiga biroz hajm bering. Soya kontrastini oshirsangiz art ancha yorqinroq va 3D ko'rinish oladi. Ball: 8.5/10!",
    mentorName: 'Akira Saydo',
    rating: 5,
    createdAt: '2026-10-20'
  }
];
