# Quick Start Guide - Hospital Bed Management System

## 🚀 Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Firebase
Copy `.env.example` to `.env.local` and add your Firebase credentials:
```bash
copy .env.example .env.local
```

### 3. Update Firebase Credentials
Edit `.env.local` with your Firebase project credentials from [Firebase Console](https://console.firebase.google.com/) > Project Settings

### 4. Run the App
```bash
npm run dev
```

Visit `http://localhost:3000`

## 📋 Next Steps After First Run

### Set Up Firebase Database

1. **Enable Firestore**
   - Firebase Console > Firestore Database
   - Click "Create database"
   - Choose production mode
   - Select a location

2. **Deploy Security Rules**
   ```bash
   firebase login
   firebase init firestore
   firebase deploy --only firestore:rules
   ```

3. **Enable Authentication**
   - Firebase Console > Authentication
   - Click "Get started"
   - Enable "Email/Password" provider

4. **Create First Admin User**
   - Authentication > Add user (add your email/password)
   - Firestore Database > Start collection: `users`
   - Document ID: your-email@example.com
   - Add field: `role` = `admin`

## 🔧 Common Commands

```bash
# Development
npm run dev              # Start dev server

# Production
npm run build           # Build for production
npm run preview         # Preview production build

# Deployment
npm run deploy          # Build and deploy to Firebase
```

## 📱 Using the App

### First Time Login
1. Use the email/password you set up in Firebase Authentication
2. If you're an admin, you'll see the "Users" button to manage other users

### Adding a Bed
1. Click "Add New Bed"
2. Fill in required fields
3. Click "Submit"

### Editing a Bed
1. Find the bed in the table
2. Click the "Edit" button
3. Update information
4. Click "Submit"

### Managing Users (Admin Only)
1. Click "Users" button in header
2. Add new users with their email and role
3. Users will need to complete registration in Firebase Auth

## ❓ Troubleshooting

### "Cannot find module '@firebase/app'" error
Run: `npm install`

### Firebase configuration errors
Check that `.env.local` exists and has correct values

### Authentication not working
Verify Email/Password is enabled in Firebase Console > Authentication

### Permission denied errors
Check Firestore security rules are deployed: `firebase deploy --only firestore:rules`

## 📚 More Help

- Full documentation: See [README.md](README.md)
- Deployment guide: See [DEPLOYMENT.md](DEPLOYMENT.md)
- Contact: shekib.kohistani@uoflhealth.org

---

**Need the old Firebase credentials?**
They're stored in `.env.local` (already created for you with your existing credentials)
