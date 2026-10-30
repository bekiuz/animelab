# AnimeLab Android APK

AnimeLab uses one React + Vite codebase for the website and the Android app. Capacitor packages the production website into an Android WebView.

## Requirements

- Node.js 22 or newer
- Android Studio 2025.2.1 or newer for Capacitor 8
- Android SDK platform 24 or newer

## First-time Android setup

Run these commands from the repository folder:

```bash
npm install
npm run build
npm run android:add
npm run android:sync
npm run android:open
```

Run `npm run android:add` only once. Later web changes need:

```bash
npm run build
npm run android:sync
```

Android Studio will open the native project. Select **Build → Build Bundle(s) / APK(s) → Build APK(s)** to create a debug APK for testing.

## Website

The website is still built with:

```bash
npm run dev
npm run build
npm run preview
```

The Vite production output is `dist/`, which is also the Capacitor web directory.

## Important before public release

- Configure and test Firebase Google sign-in on a physical Android device. The current web sign-in uses a popup and may need a native/redirect flow for the packaged app.
- Deploy and test Firestore and Storage security rules.
- Use a signed release key for a public APK; do not distribute the debug APK as a production release.
