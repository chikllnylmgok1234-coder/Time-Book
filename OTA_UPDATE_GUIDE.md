# 📱 OTA (Over-The-Air) Update System

## ওয়ার্কফ্লো

```
            অ্যাডমিন প্যানেল
                 ↓
       নতুন ভার্সন তৈরি করুন
                 ↓
       ভার্সন পাবলিশ করুন
                 ↓
         অ্যাপ ভার্সন API
                 ↓
          মোবাইল অ্যাপ চেক করে
                 ↓
      আপডেট পপআপ দেখায়
                 ↓
      ব্যবহারকারী আপডেট করে
                 ↓
         নতুন সংস্করণ চলে
```

## 🔄 কিভাবে কাজ করে

### 1️⃣ অ্যাডমিন নতুন ভার্সন তৈরি করে

```bash
POST /api/updates/admin/create
{
  "version": "1.0.1",
  "buildNumber": 2,
  "downloadUrl": "https://..../TimeBook-1.0.1.apk",
  "platform": "android",
  "fileSize": 47123456,
  "changeLog": [
    "Fixed messaging bug",
    "Improved performance",
    "Added dark mode"
  ],
  "isForceUpdate": false,
  "isOptionalUpdate": true
}
```

### 2️⃣ অ্যাডমিন ভার্সন পাবলিশ করে

```bash
POST /api/updates/admin/{versionId}/publish
```

**অবিলম্বে সকল ব্যবহারকারীকে দৃশ্যমান হয়:**
- অ্যাপ স্টোর ও Play Store এ আপডেট দেখা যায়
- অ্যাপে আপডেট নোটিফিকেশন পপ আপ করে

### 3️⃣ মোবাইল অ্যাপ চেক করে

মোবাইল অ্যাপ ক্রমাগত নিম্নলিখিত endpoint টি কল করে:

```bash
GET /api/updates/latest?platform=android&currentVersion=1.0.0
```

**রেসপন্স:**
```json
{
  "success": true,
  "updateAvailable": true,
  "currentVersion": "1.0.0",
  "latestVersion": "1.0.1",
  "isForceUpdate": false,
  "downloadUrl": "https://..../TimeBook-1.0.1.apk",
  "changeLog": ["Fixed bug", "New feature"],
  "fileSize": 47123456
}
```

### 4️⃣ ব্যবহারকারী আপডেট করে

```
┌─────────────────────────────┐
│   🔔 Update Available       │
├─────────────────────────────┤
│  Version 1.0.1 is ready    │
│                             │
│  What's New:               │
│  • Fixed messaging bug     │
│  • Improved performance    │
│  • Added dark mode         │
│                             │
│  File size: 45.5 MB        │
│                             │
│         [Later] [Update]    │
└─────────────────────────────┘
```

---

## 🔧 বৈশিষ্ট্যগুলি

### ✅ অপশনাল আপডেট
- ব্যবহারকারী আপডেট করতে পারে বা পরে করতে পারে
- "Later" বোতাম দেখা যায়
- পটভূমিতে কোন জোর নেই

### ⚠️ বাধ্যতামূলক আপডেট
- ব্যবহারকারীকে আপডেট করতে হবে
- "Later" বোতাম লুকানো থাকে
- Google Play Store এ স্বয়ংক্রিয় আপডেট সক্ষম হয়

### 📊 ট্র্যাকিং
- ডাউনলোড গণনা ট্র্যাক করা হয়
- আপডেট স্ট্যাটাস লগ করা হয়
- অ্যাডমিন ড্যাশবোর্ডে দৃশ্যমান

---

## 📱 অ্যাপ সংস্করণ আপডেট

### Android এ (version.json)

```json
{
  "currentVersion": "1.0.0",
  "buildNumber": 1,
  "versionName": "1.0.0"
}
```

### iOS এ (Info.plist)

```xml
<key>CFBundleShortVersionString</key>
<string>1.0.0</string>
<key>CFBundleVersion</key>
<string>1</string>
```

---

## 🎛️ অ্যাডমিন প্যানেল কমান্ড

### ভার্সন তালিকা দেখুন
```bash
GET /api/updates/admin/all
```

### নতুন ভার্সন তৈরি করুন (খসড়া)
```bash
POST /api/updates/admin/create
```

### ভার্সন পাবলিশ করুন (সরাসরি সব ব্যবহারকারীতে)
```bash
POST /api/updates/admin/{versionId}/publish
```

### বাধ্যতামূলক আপডেট সেট করুন
```bash
POST /api/updates/admin/{versionId}/force-update
```

### ভার্সন আপডেট করুন
```bash
PUT /api/updates/admin/{versionId}
```

### ভার্সন মুছুন (আর্কাইভ)
```bash
DELETE /api/updates/admin/{versionId}
```

---

## 🚀 দ্রুত ব্যবহার

### 1. Backend এ যোগ করুন
```bash
# server.js এ
app.use('/api/updates', require('./routes/updates'));
```

### 2. Mobile এ যোগ করুন
```jsx
import UpdateChecker from './src/components/UpdateChecker';

// App.js এ
<UpdateChecker 
  currentVersion="1.0.0" 
  platform="android"
/>
```

### 3. Admin Panel এ যোগ করুন
```jsx
import VersionManagementPanel from './components/VersionManagementPanel';

// Admin Dashboard এ
<VersionManagementPanel adminToken={adminToken} />
```

---

## 📊 ড্যাশবোর্ড

### অ্যাডমিন দেখে:
- ✅ সমস্ত ভার্সন তালিকা
- 📊 ডাউনলোড পরিসংখ্যান
- 🔔 স্ট্যাটাস (খসড়া/প্রকাশিত)
- ⚙️ শক্তি আপডেট স্লাইডার
- 📝 পরিবর্তন লগ সম্পাদনা করুন
- 🗑️ ভার্সন আর্কাইভ করুন

### ব্যবহারকারী দেখে:
- 📱 আপডেট উপলব্ধ পপআপ
- 📝 পরিবর্তন লগ তালিকা
- 📦 ফাইল আকার
- ⏰ আপডেট বা পরে বিকল্প

---

## 🔒 নিরাপত্তা

✅ শুধুমাত্র অ্যাডমিন আপডেট প্রকাশ করতে পারে
✅ সংস্করণ ভেরিফিকেশন ফ্রন্ট-এন্ড এবং ব্যাক-এন্ডে করা হয়
✅ ডাউনলোড URL যাচাই করা হয়
✅ সমস্ত API কল লগ করা হয়

---

## 📈 ভবিষ্যৎ বৈশিষ্ট্য

- 🔄 স্বয়ংক্রিয় রোলব্যাক সাপোর্ট
- 🎯 টার্গেটেড আপডেট (নির্দিষ্ট ব্যবহারকারীদের জন্য)
- 📊 বিটা পরীক্ষা গ্রুপ
- 🌍 ভৌগলিক রোলআউট
- 📱 স্বয়ংক্রিয় সংস্করণ সংক্রমণ

---

**Time Book - সর্বদা আপডেট থাকুন! ✨**
