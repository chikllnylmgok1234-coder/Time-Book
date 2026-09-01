# Time Book - Quick Start & Deployment Guide

## 🚀 Development Setup

### Prerequisites
- Node.js 16+
- MongoDB 5+
- Redis
- React Native CLI
- Android Studio / Xcode (for mobile)

### Backend Setup (5 minutes)

```bash
cd backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Add your credentials to .env:
# - MONGODB_URI
# - TWILIO_ACCOUNT_SID
# - TWILIO_AUTH_TOKEN
# - JWT_SECRET
# - AWS credentials

# Start development server
npm run dev

# Server will run on http://localhost:5000
```

### Mobile Setup (10 minutes)

```bash
cd mobile

# Install dependencies
npm install

# Android
npm run android

# iOS
npm run ios
```

### Admin Panel Setup (5 minutes)

```bash
cd admin-panel

# Install dependencies
npm install

# Start development
npm start

# Admin panel will open at http://localhost:3000
```

---

## 🔐 First Time Setup

### 1. Create Admin Account

```bash
# In backend directory, run:
node scripts/createAdmin.js

# Follow prompts:
# Email: admin@timebook.app
# Password: (strong password)
```

### 2. Initialize Database

```bash
# Collections are auto-created
# Indexes are auto-created
# No manual setup needed
```

### 3. Test Authentication

```bash
# Use test phone number in development:
# +91 9876543210
# OTP: 123456 (will appear in backend console)
```

---

## 📦 Building for Production

### Android APK Build

```bash
cd mobile/android

# Build release APK
./gradlew bundleRelease

# Output: android/app/build/outputs/bundle/release/app-release.aab

# OR build APK directly:
./gradlew assembleRelease

# Output: android/app/build/outputs/apk/release/app-release.apk
```

### iOS Build

```bash
cd mobile/ios

# Build for release
xcodebuild -workspace TimeBook.xcworkspace \
  -scheme TimeBook \
  -configuration Release \
  -derivedDataPath build
```

### Backend Deployment

#### Option 1: Docker

```bash
# Build Docker image
docker build -t timebook-backend .

# Run container
docker run -d \
  -p 5000:5000 \
  -e MONGODB_URI=mongodb://... \
  -e JWT_SECRET=your-secret \
  timebook-backend
```

#### Option 2: Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create timebook-api

# Set environment variables
heroku config:set MONGODB_URI=mongodb://...
heroku config:set JWT_SECRET=your-secret

# Deploy
git push heroku main
```

#### Option 3: DigitalOcean / AWS / GCP

1. Create VM instance (Ubuntu 20.04+)
2. SSH into server
3. Install Node.js, MongoDB, Redis
4. Clone repository
5. Setup environment variables
6. Run `npm start` in backend
7. Setup Nginx as reverse proxy
8. Setup SSL certificate (Let's Encrypt)

---

## 📱 Publishing Apps

### Google Play Store (Android)

1. Create Google Play Developer Account ($25 one-time)
2. Create app listing
3. Upload release APK/AAB
4. Fill store listing details
5. Submit for review (1-3 hours)

**Steps:**
```
Google Play Console
  → Create new app
  → Add app icon (512x512 PNG)
  → Add screenshots
  → Add description
  → Upload APK
  → Set pricing (Free)
  → Submit for review
```

### App Store (iOS)

1. Enroll in Apple Developer Program ($99/year)
2. Create app listing in App Store Connect
3. Create app certificate & provisioning profile
4. Build with Xcode
5. Upload via Transporter or Xcode
6. Submit for review (24-48 hours)

**Steps:**
```
App Store Connect
  → Create new app
  → Add app icon (1024x1024 PNG)
  → Add screenshots
  → Add description
  → Build with Xcode
  → Upload to TestFlight (optional)
  → Submit for review
```

---

## 🔑 Environment Variables

### Backend (.env)

```
# Server
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/timebook

# JWT
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# OTP (Twilio)
TWILIO_ACCOUNT_SID=ACxxxxxx
TWILIO_AUTH_TOKEN=your-token
TWILIO_PHONE_NUMBER=+1234567890

# AWS S3
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION=us-east-1
AWS_S3_BUCKET=timebook-uploads

# Redis
REDIS_URL=redis://user:password@localhost:6379

# CORS
CORS_ORIGIN=https://timebook.app,https://admin.timebook.app
```

### Mobile (config/constants.js)

```javascript
export const API_URL = 'https://api.timebook.app';
export const SOCKET_URL = 'https://api.timebook.app';
```

---

## 📊 Admin Panel Access

**URL:** `https://admin.timebook.app`

**Login:**
- Email: admin@timebook.app
- Password: (your secure password)

**2FA:** Required for admin accounts

---

## ✅ Testing

### Test Credentials

```
Phone: +91 9876543210
OTP: 123456 (dev mode)
Username: testuser
Password: TestPass123!
```

### API Testing

```bash
# Test OTP request
curl -X POST http://localhost:5000/api/auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+91 9876543210", "countryCode": "+91"}'

# Test health
curl http://localhost:5000/api/health
```

---

## 🔒 Security Checklist

- [ ] All secrets in environment variables (not in code)
- [ ] Database backups enabled
- [ ] HTTPS/WSS for all connections
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Admin 2FA enabled
- [ ] Database encryption enabled
- [ ] File uploads scanned for malware
- [ ] Regular security audits
- [ ] Incident response plan documented

---

## 📈 Monitoring

### Recommended Tools

- **Logs:** ELK Stack / Datadog / CloudWatch
- **Errors:** Sentry
- **Performance:** New Relic / DataDog
- **Uptime:** UptimeRobot / StatusPage
- **Analytics:** Google Analytics / Mixpanel

---

## 🆘 Troubleshooting

### Backend won't start
```bash
# Check MongoDB connection
mongo --uri "mongodb://localhost:27017/timebook"

# Check Redis
redis-cli ping  # should return PONG

# Check logs
NODE_ENV=development npm run dev
```

### Mobile app can't connect to backend
```bash
# Check API URL in constants.js
# For Android emulator: http://10.0.2.2:5000
# For iOS simulator: http://localhost:5000
# For physical device: http://your-ip:5000
```

### OTP not received
- Check Twilio credentials
- Check phone number format
- Check Twilio trial account limits
- Check SMS logs in Twilio dashboard

---

## 📞 Support

For issues:
1. Check GitHub Issues
2. Review documentation
3. Create bug report with details
4. Contact admin@timebook.app

---

**Last Updated:** 2024
**Version:** 1.0.0
