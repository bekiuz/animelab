export type UserRole = 'student' | 'mentor' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  bio?: string;
  level: number;
  xp: number;
  badges: string[];
  createdAt?: string;
  updatedAt?: string;
}

export type CourseDifficulty = "Boshlang'ich" | "O'rta" | "Yuqori";

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: CourseDifficulty;
  instructor: string;
  thumbnail: string;
  duration: string;
  lessonsCount: number;
  rating: number;
  enrolledCount: number;
  isPublished: boolean;
  createdAt: string;
}

export interface LessonStep {
  stepNumber: number;
  title: string;
  description: string;
  imageUrl?: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  duration: string;
  videoUrl: string;
  content: string;
  steps?: LessonStep[];
  order: number;
  isFree: boolean;
  createdAt: string;
}

export interface UserProgress {
  id: string;
  userId: string;
  courseId: string;
  completedLessonIds: string[];
  progressPercent: number;
  lastAccessedAt: string;
}

export interface Artwork {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  category: string;
  likesCount: number;
  likes: string[]; // User IDs who liked
  viewsCount: number;
  isFeatured?: boolean;
  competitionId?: string;
  createdAt: string;
}

export type CompetitionStatus = 'active' | 'upcoming' | 'completed';

export interface Competition {
  id: string;
  title: string;
  description: string;
  theme: string;
  prize: string;
  startDate: string;
  endDate: string;
  rules: string[];
  coverImage: string;
  status: CompetitionStatus;
  entriesCount: number;
  winnerArtworkId?: string;
  createdAt: string;
}

export interface MentorshipRequest {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  artworkUrl: string;
  title: string;
  description: string;
  status: 'pending' | 'reviewed';
  feedback?: string;
  mentorName?: string;
  rating?: number;
  createdAt: string;
}

export interface PracticeTutorial {
  id: string;
  title: string;
  category: string;
  difficulty: CourseDifficulty;
  thumbnail: string;
  description: string;
  steps: {
    number: number;
    title: string;
    description: string;
    overlayImage: string; // Base trace guide for canvas
    tips: string[];
  }[];
}
