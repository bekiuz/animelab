import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, signInWithGoogle, logoutUser, handleFirestoreError, OperationType } from '../lib/firebase';
import { UserProfile, UserRole } from '../types';
import { DEFAULT_ANIME_GIRL_AVATAR } from '../data/initialData';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isMentor: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  addXP: (amount: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await fetchOrCreateUserProfile(firebaseUser);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchOrCreateUserProfile = async (firebaseUser: User) => {
    const userRef = doc(db, 'users', firebaseUser.uid);
    try {
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as UserProfile;
        // Check if admin email
        if (firebaseUser.email === 'bekiuz282@gmail.com' && data.role !== 'admin') {
          const updatedProfile = { ...data, role: 'admin' as UserRole };
          await setDoc(userRef, updatedProfile, { merge: true });
          setProfile(updatedProfile);
        } else {
          setProfile({ ...data, uid: firebaseUser.uid });
        }
      } else {
        // Create new profile
        const defaultRole: UserRole = firebaseUser.email === 'bekiuz282@gmail.com' ? 'admin' : 'student';
        const newProfile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || 'Anime Artist',
          photoURL: firebaseUser.photoURL || DEFAULT_ANIME_GIRL_AVATAR,
          role: defaultRole,
          bio: "AnimeLab platformasida yapon san'atini o'rganayotgan yosh rassom.",
          level: 1,
          xp: 100,
          badges: ["Boshlang'ich Rassom", "AnimeLab A'zosi"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        await setDoc(userRef, newProfile);
        setProfile(newProfile);
      }
    } catch (error) {
      console.error('Error fetching/creating user profile:', error);
      // Fallback local profile state if Firestore write is delayed
      setProfile({
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || 'Anime Artist',
        photoURL: firebaseUser.photoURL || undefined,
        role: firebaseUser.email === 'bekiuz282@gmail.com' ? 'admin' : 'student',
        level: 1,
        xp: 100,
        badges: ["Boshlang'ich Rassom"],
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
    } catch (error) {
      console.error('Google Auth Failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setProfile(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfileData = async (data: Partial<UserProfile>) => {
    if (!user || !profile) return;
    const userRef = doc(db, 'users', user.uid);
    const updated = { ...profile, ...data, updatedAt: new Date().toISOString() };
    try {
      await updateDoc(userRef, updated);
      setProfile(updated);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
      setProfile(updated); // fallback optimistic update
    }
  };

  const addXP = async (amount: number) => {
    if (!profile || !user) return;
    const newXP = profile.xp + amount;
    const newLevel = Math.floor(newXP / 300) + 1;
    
    let newBadges = [...profile.badges];
    if (newLevel >= 3 && !newBadges.includes("O'rta Darajali Illustrator")) {
      newBadges.push("O'rta Darajali Illustrator");
    }
    if (newLevel >= 5 && !newBadges.includes('Anime Master')) {
      newBadges.push('Anime Master');
    }

    await updateProfileData({
      xp: newXP,
      level: newLevel,
      badges: newBadges,
    });
  };

  const isAdmin = profile?.role === 'admin' || user?.email === 'bekiuz282@gmail.com';
  const isMentor = profile?.role === 'mentor' || isAdmin;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAdmin,
        isMentor,
        loginWithGoogle: handleGoogleLogin,
        logout: handleLogout,
        updateProfile: updateProfileData,
        addXP,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
