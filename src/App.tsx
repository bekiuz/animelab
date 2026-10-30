import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { StudioPage } from './pages/StudioPage';
import { CoursesPage } from './pages/CoursesPage';
import { PracticePage } from './pages/PracticePage';
import { GalleryPage } from './pages/GalleryPage';
import { CompetitionsPage } from './pages/CompetitionsPage';
import { MentorshipPage } from './pages/MentorshipPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';

import { InteractiveCanvasModal } from './components/InteractiveCanvasModal';
import { ArtworkUploadModal } from './components/ArtworkUploadModal';
import { AIAssistantModal } from './components/AIAssistantModal';
import { CourseDetailModal } from './components/CourseDetailModal';

import { Course, Competition, Artwork } from './types';
import {
  INITIAL_COURSES,
  INITIAL_COMPETITIONS,
  INITIAL_ARTWORKS,
} from './data/initialData';

import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from './lib/firebase';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [competitions, setCompetitions] = useState<Competition[]>(INITIAL_COMPETITIONS);
  const [artworks, setArtworks] = useState<Artwork[]>(INITIAL_ARTWORKS);

  // Modal States
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  const [guideImage, setGuideImage] = useState<string | undefined>();
  const [guideTitle, setGuideTitle] = useState<string | undefined>();

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Fetch courses from Firestore in real-time
  useEffect(() => {
    const q = query(collection(db, 'courses'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetched: Course[] = [];
        snapshot.forEach((docSnap) => {
          fetched.push({ id: docSnap.id, ...docSnap.data() } as Course);
        });
        if (fetched.length > 0) {
          setCourses(fetched);
        }
      },
      (err) => console.warn('Courses real-time error:', err)
    );

    return () => unsubscribe();
  }, []);

  // Fetch competitions from Firestore in real-time
  useEffect(() => {
    const q = query(collection(db, 'competitions'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetched: Competition[] = [];
        snapshot.forEach((docSnap) => {
          fetched.push({ id: docSnap.id, ...docSnap.data() } as Competition);
        });
        if (fetched.length > 0) {
          setCompetitions(fetched);
        }
      },
      (err) => console.warn('Competitions real-time error:', err)
    );

    return () => unsubscribe();
  }, []);

  // Fetch artworks from Firestore in real-time
  useEffect(() => {
    const q = query(collection(db, 'artworks'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetched: Artwork[] = [];
        snapshot.forEach((docSnap) => {
          fetched.push({ id: docSnap.id, ...docSnap.data() } as Artwork);
        });
        if (fetched.length > 0) {
          setArtworks(fetched);
        }
      },
      (err) => console.warn('Artworks real-time error:', err)
    );

    return () => unsubscribe();
  }, []);

  const handleOpenCanvasWithGuide = (img?: string, title?: string) => {
    setGuideImage(img);
    setGuideTitle(title);
    setIsCanvasOpen(true);
  };

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-[#0c081e] text-slate-100 selection:bg-purple-600 selection:text-white">
        
        {/* Navigation Header */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenCanvas={() => handleOpenCanvasWithGuide()}
          onOpenUpload={() => setIsUploadOpen(true)}
          onOpenAI={() => setIsAIOpen(true)}
        />

        {/* Page Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          {activeTab === 'home' && (
            <HomePage
              courses={courses}
              competitions={competitions}
              artworks={artworks}
              setActiveTab={setActiveTab}
              onOpenCourse={(c) => setSelectedCourse(c)}
              onOpenCanvas={() => handleOpenCanvasWithGuide()}
              onOpenUpload={() => setIsUploadOpen(true)}
              onOpenAI={() => setIsAIOpen(true)}
            />
          )}

          {activeTab === 'studio' && (
            <StudioPage />
          )}

          {activeTab === 'courses' && (
            <CoursesPage
              courses={courses}
              onOpenCourse={(c) => setSelectedCourse(c)}
            />
          )}

          {activeTab === 'practice' && (
            <PracticePage
              onOpenCanvasWithGuide={(img, title) => handleOpenCanvasWithGuide(img, title)}
            />
          )}

          {activeTab === 'gallery' && (
            <GalleryPage
              artworks={artworks}
              onOpenUpload={() => setIsUploadOpen(true)}
            />
          )}

          {activeTab === 'competitions' && (
            <CompetitionsPage
              competitions={competitions}
              artworks={artworks}
              onOpenUpload={() => setIsUploadOpen(true)}
            />
          )}

          {activeTab === 'mentorship' && (
            <MentorshipPage
              onOpenAI={() => setIsAIOpen(true)}
            />
          )}

          {activeTab === 'profile' && (
            <ProfilePage
              artworks={artworks}
              courses={courses}
              onOpenUpload={() => setIsUploadOpen(true)}
            />
          )}

          {activeTab === 'admin' && (
            <AdminPage
              courses={courses}
              competitions={competitions}
              artworks={artworks}
            />
          )}
        </main>

        {/* Modals & Dialogs */}
        <InteractiveCanvasModal
          isOpen={isCanvasOpen}
          onClose={() => setIsCanvasOpen(false)}
          initialGuideImage={guideImage}
          guideTitle={guideTitle}
        />

        <ArtworkUploadModal
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          competitions={competitions}
        />

        <AIAssistantModal
          isOpen={isAIOpen}
          onClose={() => setIsAIOpen(false)}
        />

        <CourseDetailModal
          course={selectedCourse}
          isOpen={!!selectedCourse}
          onClose={() => setSelectedCourse(null)}
          onOpenCanvasWithGuide={(img, title) => handleOpenCanvasWithGuide(img, title)}
        />

        {/* Global Footer */}
        <Footer setActiveTab={setActiveTab} />

      </div>
    </AuthProvider>
  );
}
