# AnimeLab Android APK

AnimeLab keeps one React + Vite codebase for the website and Android app. Capacitor packages the production website into an Android application.

## Requirements

- Node.js 22 or newer
- Android Studio 2025.2.1 or newer for Capacitor 8
- Android SDK platform 24 or newer

## First-time Android setup

Run these commands from the repository folder:

```bash
npm install
npm install @capacitor/core@^8 @capacitor/android@^8
npm install --save-dev @capacitor/cli@^8
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

Run `npx cap add android` only once. Later web changes need:

```bash
npm run build
npx cap sync android
```

Android Studio will open the native project. Select **Build → Build Bundle(s) / APK(s) → Build APK(s)** to create a debug APK for testing.

## Website

The website is built separately from the same source:

```bash
npm install
npm run dev
npm run build
npm run preview
```

The Vite production output is `dist/`, which is also the Capacitor web directory.

## Important before public release

- Test Firebase Google sign-in on a physical Android device. The current web login uses a popup and may need a Capacitor-native or redirect flow.
- Deploy and test Firestore rules before releasing.
- Use a signed release key for a public APK; do not distribute a debug APK as a production release.
