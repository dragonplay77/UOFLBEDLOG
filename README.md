# 🏥 Hospital Bed Management System

A modern, real-time hospital bed tracking and management application built with React, TypeScript, Firebase, and Vite.

## ✨ Features

- **Real-time Bed Tracking** - Live updates using Firebase Firestore
- **User Authentication** - Secure login with Firebase Auth
- **Role-Based Access Control** - Admin, Editor, and Viewer roles
- **Bed Management** - Add, edit, and track bed status and patient information
- **Search & Filter** - Quickly find beds by patient name, location, or notes
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **User Management** - Admin dashboard for managing user roles and permissions
- **New Hire Guide** - Built-in documentation for onboarding

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Firebase account** - [Create one here](https://firebase.google.com/)
- **Git** - For version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/hospital-bed-log.git
   cd hospital-bed-log
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or select an existing one
   - Enable **Authentication** (Email/Password provider)
   - Enable **Firestore Database**
   - Get your Firebase configuration from Project Settings > General > Your apps

4. **Configure environment variables**
   - Copy `.env.example` to `.env.local`:
     ```bash
     copy .env.example .env.local
     ```
   - Update `.env.local` with your Firebase credentials:
     ```env
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
     ```

5. **Set up Firestore Security Rules**
   - In Firebase Console, go to Firestore Database > Rules
   - Copy the rules from `firestore.rules` file
   - Publish the rules

6. **Create initial admin user**
    - In Firebase Console, go to Authentication and create a new user (email + password)
    - In Firestore, create a collection called `users`
    - Add a document with the **UID** (not email) from the created auth user as the document ID
    - Add fields:
       ```json
       {
          "uid": "(same uid as document id)",
          "email": "user@example.com",
          "role": "Admin"
       }
       ```

### Running Locally

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run deploy` - Build and deploy to Firebase Hosting

## 🚀 Deployment to Firebase

### First Time Setup

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firebase project**
   ```bash
   firebase init
   ```
   - Select: Hosting, Firestore
   - Choose your Firebase project
   - Use `dist` as the public directory
   - Configure as a single-page app: Yes
   - Don't overwrite existing files

4. **Deploy**
   ```bash
   npm run deploy
   ```

### Subsequent Deployments

Simply run:
```bash
npm run deploy
```

## 📁 Project Structure

```
hospital-bed-log/
├── components/          # React components
│   ├── BedForm.tsx
│   ├── BedLogTable.tsx
│   ├── BedSummary.tsx
│   ├── Modal.tsx
│   ├── NewHireGuide.tsx
│   ├── SelectInput.tsx
│   ├── TextInput.tsx
│   └── UserManagement.tsx
├── App.tsx             # Main app component
├── LoginPage.tsx       # Authentication page
├── firebase.ts         # Firebase configuration
├── types.ts            # TypeScript type definitions
├── constants.ts        # App constants
├── index.tsx           # App entry point
├── firebase.json       # Firebase hosting config
├── firestore.rules     # Firestore security rules
└── vite.config.ts      # Vite configuration
```

## 🔐 Security

- Firebase credentials are stored in environment variables
- Never commit `.env.local` or `.env` files to version control
- Firestore security rules enforce role-based access control
- Authentication required for all database operations

## 👥 User Roles

- **Admin** - Full access: manage users, add/edit/delete beds
- **Editor** - Can add and edit beds, cannot manage users
- **Viewer** - Read-only access to bed information

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Shekib Kohistani**
- Email: shekib.kohistani@uoflhealth.org

## 🐛 Support

For issues, questions, or feature requests, please contact:
- Email: shekib.kohistani@uoflhealth.org
- Create an issue in the GitHub repository

## 📋 To-Do / Future Features

- [ ] Export data to CSV/Excel
- [ ] Advanced analytics and reporting
- [ ] Email notifications
- [ ] Bed assignment history
- [ ] Mobile app version
- [ ] Print-friendly bed reports

---

© 2025 Hospital Bed Management System. All rights reserved.
