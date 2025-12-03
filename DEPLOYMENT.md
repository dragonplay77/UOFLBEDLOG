# Hospital Bed Management System - Deployment Guide

## Prerequisites

- Node.js (v18+)
- Firebase CLI installed globally: `npm install -g firebase-tools`
- Firebase project created
- Git repository set up

## Step-by-Step Deployment

### 1. Initial Firebase Setup

```bash
# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init
```

When prompted, select:
- ✓ Firestore: Configure security rules and indexes files
- ✓ Hosting: Configure files for Firebase Hosting

Configuration answers:
- Firestore rules file: `firestore.rules` (already exists)
- Firestore indexes file: `firestore.indexes.json` (already exists)
- Public directory: `dist`
- Single-page app: `Yes`
- Set up automatic builds with GitHub: `No` (optional)
- Overwrite files: `No`

### 2. Configure Firebase Project

```bash
# Set your Firebase project (replace with your project ID)
firebase use --add
```

Select your project and give it an alias (e.g., "production")

### 3. Set Up Firestore Database

1. Go to Firebase Console > Firestore Database
2. Create database in production mode (or test mode for development)
3. Deploy security rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

### 4. Set Up Authentication

1. Go to Firebase Console > Authentication
2. Enable Email/Password sign-in method
3. Add your first admin user manually:
   - Click "Add user"
   - Enter email and password
4. In Firestore, create initial admin:
   - Go to Firestore Database
   - Create collection: `users`
   - Add document with ID as the admin email
   - Add field: `role: "admin"`

### 5. Environment Variables for Production

Update your `.env.local` with production Firebase credentials from Firebase Console > Project Settings.

**Important**: Never commit `.env.local` to Git!

### 6. Build and Deploy

```bash
# Build the app
npm run build

# Deploy to Firebase Hosting
firebase deploy

# Or use the combined script
npm run deploy
```

### 7. Verify Deployment

After deployment completes, Firebase will provide a hosting URL. Visit it to verify your app is working.

## Updating Your Deployment

For subsequent updates:

```bash
git add .
git commit -m "Your update description"
git push origin main
npm run deploy
```

## Environment Variables in CI/CD

If using GitHub Actions or other CI/CD:

1. Add Firebase secrets to your CI/CD environment
2. Use `firebase deploy --token $FIREBASE_TOKEN`
3. Generate token with: `firebase login:ci`

## Rollback

To rollback to a previous deployment:

```bash
firebase hosting:rollback
```

## Custom Domain Setup

1. Go to Firebase Console > Hosting
2. Click "Add custom domain"
3. Follow the DNS configuration instructions
4. Wait for SSL certificate provisioning (can take 24 hours)

## Monitoring

- View logs: Firebase Console > Functions (if using) or Hosting
- Analytics: Firebase Console > Analytics
- Performance: Firebase Console > Performance Monitoring

## Troubleshooting

### Build fails
- Check all environment variables are set correctly
- Run `npm install` to ensure dependencies are up to date
- Check for TypeScript errors: `npm run build`

### Deployment fails
- Verify you're logged into Firebase: `firebase login`
- Check project is selected: `firebase projects:list`
- Ensure billing is enabled for your Firebase project

### 404 errors after deployment
- Verify `firebase.json` has the rewrite rule for single-page app
- Check that `dist` folder was created during build

## Security Checklist

- [ ] Firestore security rules deployed
- [ ] Environment variables not committed to Git
- [ ] Authentication enabled
- [ ] Admin user created with proper role
- [ ] `.env.local` added to `.gitignore`
- [ ] Production Firebase config separate from development

## Cost Optimization

- Enable caching headers (already configured in `firebase.json`)
- Monitor Firebase usage in Console
- Set up budget alerts in Firebase Console

---

For support: skbedlog@gmail.com
