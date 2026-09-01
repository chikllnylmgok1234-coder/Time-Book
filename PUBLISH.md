# Time Book - Publish to App Stores

## 📱 Android - Google Play Store

### Step 1: Prepare APK/AAB

```bash
cd mobile/android

# Build release AAB (recommended)
./gradlew bundleRelease

# Output: app/build/outputs/bundle/release/app-release.aab

# OR build APK
./gradlew assembleRelease

# Output: app/build/outputs/apk/release/app-release.apk
```

### Step 2: Create Developer Account

1. Go to [Google Play Console](https://play.google.com/console)
2. Pay $25 registration fee
3. Verify Google Account
4. Add payment method
5. Accept agreements

### Step 3: Create App

1. Click "Create app"
2. App name: "Time Book"
3. Default language: English
4. App type: Apps
5. Category: Communication
6. Content rating: Suitable for all ages

### Step 4: Fill Store Listing

**App icon:**
- Size: 512x512 px
- Format: PNG
- File: `mobile/assets/icon-512.png`

**Screenshots (minimum 2):**
- Size: 1080x1920 px (portrait)
- Show: Chat screen, calls, status
- At least 2 screenshots

**Short description (80 characters):**
```
Secure messaging, calls, and status updates
```

**Full description (4000 characters):**
```
Time Book is a modern, secure communication platform.

Features:
• One-to-one messaging
• Voice and video calls
• Status updates (24-hour expiry)
• QR code sharing
• End-to-end encryption
• Privacy controls
• Dark mode
• Multi-language support

Join millions of users worldwide.
Connect. Share. Anytime.
```

**Content rating:**
- Complete questionnaire
- Usually rated 3+ years

**Target audience:**
- Check: Teens (16+)
- Check: Adults (18+)

### Step 5: Upload APK/AAB

1. Go to "Testing" → "Internal testing"
2. Click "Create release"
3. Upload `app-release.aab`
4. Add release notes
5. Save

### Step 6: Prepare for Review

1. Go to "Production" release
2. Click "Create release"
3. Upload `app-release.aab`
4. Add release notes
5. Review all sections
6. Accept policies
7. Click "Submit for review"

**Review time:** 1-3 hours

---

## 🍎 iOS - App Store

### Step 1: Prepare Build

```bash
cd mobile/ios

# Open in Xcode
open TimeBook.xcworkspace

# Build settings:
# - Bundle ID: com.timebook.app
# - Version: 1.0.0
# - Build: 1
# - Signing: Automatic

# Build archive
xcodebuild -workspace TimeBook.xcworkspace \
  -scheme TimeBook \
  -configuration Release \
  archive -archivePath ./build/TimeBook.xcarchive
```

### Step 2: Create Developer Account

1. Go to [Apple Developer](https://developer.apple.com)
2. Join Apple Developer Program ($99/year)
3. Agree to license
4. Add payment method
5. Verify email

### Step 3: Create Certificates

1. Go to Certificates, Identifiers & Profiles
2. Create iOS App ID
   - Bundle ID: `com.timebook.app`
   - Capabilities: Push Notifications, Keychain Sharing

3. Create Distribution Certificate
   - Request CSR from Mac
   - Download certificate
   - Install in Keychain

4. Create Provisioning Profile
   - Type: App Store
   - App ID: TimeBook
   - Download and install

### Step 4: Create App Store Connect App

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Click "Apps"
3. Click "+" → "New App"
4. Platform: iOS
5. Bundle ID: `com.timebook.app`
6. SKU: TIMEBOOK001
7. App name: Time Book

### Step 5: Fill App Information

**App Icon:**
- Size: 1024x1024 px
- Format: PNG
- File: `mobile/assets/icon-1024.png`

**Screenshots (minimum 2):**
- Size: 1170x2532 px (portrait)
- Show: Chat, calls, status, QR

**Preview Video (optional):**
- Duration: 15-30 seconds
- Show app demo

**Description:**
```
Time Book is a modern, secure communication app.

✨ Features:
• Instant messaging
• Voice & video calls
• Status updates
• QR code profiles
• End-to-end encryption
• Privacy controls
• Dark mode
• Multi-language

Connect. Share. Anytime.
```

**Keywords:**
```
messaging, chat, calls, secure, privacy, communication
```

**Support URL:**
```
https://timebook.app/support
```

**Privacy Policy URL:**
```
https://timebook.app/privacy
```

**Version Release Notes:**
```
• First release
• Complete messaging platform
• Voice and video calls
• Status updates
• QR code sharing
```

### Step 6: Content Rating

1. Complete Age Rating Questionnaire
2. For messaging app:
   - Unrestricted Web Access: Yes
   - User-generated content: Yes
   - Rating: 4+

### Step 7: Pricing

- Select "Free"
- Availability: All regions
- Save

### Step 8: Upload Build

1. In Xcode: Product → Archive
2. In Organizer: Distribute App
3. Select: App Store Connect
4. Select: Upload
5. Sign automatically
6. Upload

**Wait for processing:** 5-15 minutes

### Step 9: Submit for Review

1. Go to App Store Connect
2. Select "Build"
3. Choose uploaded build
4. Complete submission details
5. Select export compliance: No encryption (standard HTTPS)
6. Accept agreements
7. Click "Submit for Review"

**Review time:** 24-48 hours

---

## 🔔 After Publishing

### Monitor Reviews & Ratings
```
Google Play Console → Reviews
App Store Connect → Ratings and Reviews
```

### Respond to Feedback
- Reply to negative reviews
- Thank positive reviewers
- Fix reported issues
- Release updates

### Update App

#### Android
```bash
# Increment version
# versionCode: 2
# versionName: "1.0.1"

./gradlew bundleRelease
# Upload to Google Play
```

#### iOS
```
# Increment build number in Xcode
# Version: 1.0.1 (or 1.0.0 if patch)
# Build: 2

# Archive and upload
```

### Announce Update
- Post release notes
- Share on social media
- Email users
- Update website

---

## ✅ Pre-Launch Checklist

### Code
- [ ] All features working
- [ ] No console errors
- [ ] Performance optimized
- [ ] Security audit passed
- [ ] Privacy policy updated
- [ ] Terms of service ready

### App Store Requirements
- [ ] Privacy policy URL (required)
- [ ] Support contact info
- [ ] App description
- [ ] Screenshots
- [ ] App icon
- [ ] Category selected
- [ ] Content rating
- [ ] Age restrictions

### Marketing
- [ ] Website ready
- [ ] Social media accounts
- [ ] Press release
- [ ] Influencer outreach
- [ ] Email list
- [ ] Landing page

---

## 🚀 Launch Day

1. **Submit to app stores** (24-48 hours before launch)
2. **Schedule announcement** (at launch time)
3. **Monitor app store** (refresh listings)
4. **Monitor social media** (respond to comments)
5. **Track installs** (in analytics)
6. **Fix critical bugs** (immediately)
7. **Publish press release** (optional)
8. **Email users** (notify about launch)

---

## 📊 Post-Launch Analytics

### Google Play Console
```
Dashboard
  → Installs & uninstalls
  → Active installs
  → Rating distribution
  → Reviews
  → Crashes
  → ANRs
```

### App Store Connect
```
Analytics
  → Units sold
  → Revenue
  → Impressions
  → Page views
  → Conversions
  → Crashes
```

---

**Ready to launch? Let's go! 🚀**
