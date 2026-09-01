# Time Book Architecture

## System Overview

```
┌─────────────────────────────────────��───────────────────┐
│                    Time Book System                      │
├─────────────────┬───────────────────┬───────────────────┤
│  Mobile App     │   Admin Panel     │   Backend API     │
│  (React Native/ │   (React Admin)   │   (Node.js)       │
│   Flutter)      │                   │                   │
└────────┬────────┴───────────┬───────┴────────┬──────────┘
         │                    │                │
         └────────┬───────────┴────────┬───────┘
                  │                    │
          ┌───────▼────────────────────▼──────┐
          │     REST API / WebSocket           │
          │     (HTTPS/WSS)                    │
          └───────────────┬────────────────────┘
                          │
          ┌───────────────▼──────────────────┐
          │  Backend Services                │
          ├──────────────────────────────────┤
          │ - Authentication & OTP           │
          │ - User Management                │
          │ - Messaging Engine               │
          │ - Call Signaling (WebRTC)        │
          │ - Real-time Presence             │
          │ - File Storage Service           │
          │ - Push Notifications             │
          │ - Moderation System              │
          └───────────────┬──────────────────┘
                          │
          ┌───────────────▼──────────────────┐
          │  Data Layer                      │
          ├──────────────────────────────────┤
          │ - PostgreSQL/MongoDB             │
          │ - Redis Cache                    │
          │ - File Storage (S3)              │
          │ - Search (Elasticsearch)         │
          └──────────────────────────────────┘
```

## Authentication Flow

```
1. Phone Number Entry
   ↓
2. Server validates phone number
   ↓
3. Send real OTP via SMS provider (Twilio/Firebase)
   ↓
4. User enters OTP
   ↓
5. Server verifies OTP
   ↓
6. Create/Login account
   ↓
7. Generate secure JWT token
   ↓
8. Store token securely (device keystore)
   ↓
9. Access Time Book
```

## Message Flow

```
Sender
   ↓
Compose message
   ↓
Encrypt (optional: end-to-end)
   ↓
Send to backend API
   ↓
Backend stores in database
   ↓
Backend sends push notification to recipient
   ↓
Backend sends via WebSocket to recipient (if online)
   ↓
Recipient receives notification
   ↓
Recipient app fetches message
   ↓
Decrypt (if encrypted)
   ↓
Display in chat
   ↓
Send read receipt
```

## Real-time Communication

### WebSocket Events

```javascript
// Client → Server
'message:send'       // Send message
'typing:start'       // User typing
'typing:stop'        // Stopped typing
'presence:update'    // Online/offline
'call:initiate'      // Start call
'call:accept'        // Accept call
'call:reject'        // Reject call
'call:end'           // End call
'status:post'        // Post status
'reaction:add'       // Add emoji reaction

// Server → Client
'message:received'   // New message
'user:typing'        // Someone typing
'user:online'        // User online
'user:offline'       // User offline
'call:incoming'      // Incoming call
'call:connected'     // Call connected
'call:disconnected'  // Call disconnected
'notification:push'  // Push notification
```

## Security Architecture

### Authentication
- OTP-based phone verification
- JWT token for authenticated sessions
- Refresh tokens for long-lived sessions
- Token expiration and rotation

### Data Protection
- HTTPS/WSS for all communications
- Password hashing: Argon2id
- API rate limiting
- Input validation & sanitization
- SQL injection protection
- CSRF protection

### Privacy
- Server-side privacy enforcement
- Profile visibility controls
- Status privacy settings
- Message deletion options
- Block & report functionality
- User data deletion on request

### Admin Security
- Separate admin authentication
- Role-based access control (RBAC)
- 2FA for admin accounts
- Comprehensive audit logging
- Admin action approval workflow
- Secure key management

## Database Schema (Overview)

### Core Collections/Tables

#### users
```
- id (PK)
- phoneNumber (unique)
- username (unique)
- passwordHash
- name
- profilePhoto
- about
- verified (boolean)
- createdAt
- updatedAt
- lastSeen
- isOnline
- privacySettings (JSON)
- securitySettings (JSON)
```

#### messages
```
- id (PK)
- senderId (FK)
- recipientId (FK)
- chatId (FK)
- content
- mediaUrls[]
- reactions[]
- isEdited
- editedAt
- deletedFor[]
- isReply (boolean)
- replyToId (FK)
- status (sent, delivered, read)
- createdAt
```

#### chats
```
- id (PK)
- participantIds[]
- isGroup (boolean)
- groupName
- groupPhoto
- lastMessage
- lastMessageTime
- unreadCount (per user)
- mutedUntil
- createdAt
```

#### status
```
- id (PK)
- userId (FK)
- content (text/photo/video)
- mediaUrl
- privacyLevel (everyone, contacts, nobody)
- viewers[]
- anonymousViews (count)
- expiresAt
- createdAt
```

#### calls
```
- id (PK)
- initiatorId (FK)
- recipientId (FK)
- type (voice, video)
- status (initiated, ringing, connected, ended, rejected, missed)
- startTime
- endTime
- duration
- createdAt
```

#### qrCodes
```
- id (PK)
- userId (FK)
- profileId (secure)
- qrData (encoded)
- createdAt
- expiresAt
```

#### adminLogs
```
- id (PK)
- adminId (FK)
- action
- targetUserId (FK)
- reason
- details (JSON)
- timestamp
```

## API Endpoints (Summary)

### Authentication
```
POST   /api/auth/phone-verify      # Request OTP
POST   /api/auth/otp-verify        # Verify OTP
POST   /api/auth/register          # Create account
POST   /api/auth/login             # Login
POST   /api/auth/logout            # Logout
POST   /api/auth/refresh           # Refresh token
```

### Messages
```
GET    /api/chats                  # List chats
GET    /api/chats/:id              # Get chat messages
POST   /api/messages               # Send message
PUT    /api/messages/:id           # Edit message
DELETE /api/messages/:id           # Delete message
POST   /api/messages/:id/react     # Add reaction
```

### Calls
```
POST   /api/calls/initiate         # Start call
POST   /api/calls/:id/accept       # Accept call
POST   /api/calls/:id/reject       # Reject call
POST   /api/calls/:id/end          # End call
GET    /api/calls/history          # Call history
```

### Status
```
GET    /api/status/feed            # Status feed
POST   /api/status/create          # Create status
DELETE /api/status/:id             # Delete status
POST   /api/status/:id/view        # Mark as viewed
GET    /api/status/:id/viewers     # Get viewers
```

### Profile
```
GET    /api/profile                # Get own profile
GET    /api/profile/:id            # Get user profile
PUT    /api/profile                # Update profile
GET    /api/profile/:id/qr         # Get QR code
POST   /api/profile/qr/generate    # Generate QR
POST   /api/profile/qr/scan        # Scan QR
```

### Admin
```
GET    /api/admin/users            # List users
GET    /api/admin/reports          # List reports
POST   /api/admin/suspend-user     # Suspend user
GET    /api/admin/logs             # Admin logs
GET    /api/admin/analytics        # System analytics
```

## Deployment

### Backend
- Docker containerization
- Kubernetes orchestration (optional)
- CI/CD pipeline (GitHub Actions)
- Automated testing
- Security scanning

### Mobile
- Android APK signing
- iOS provisioning
- App Store & Play Store publishing
- OTA updates management

### Admin Panel
- Static hosting (Vercel/Netlify)
- CDN for assets
- Environment-based configuration

## Performance Optimization

- Database indexing
- Redis caching layer
- Message pagination (limit 50)
- Image compression & thumbnails
- Video transcoding (optional)
- Lazy loading UI components
- Background sync for offline messages
- Connection pooling
- Query optimization

## Monitoring & Logging

- Centralized logging (ELK/Datadog)
- Real-time error tracking (Sentry)
- Performance monitoring (New Relic)
- Database query analysis
- API response time tracking
- User session analytics
- Push notification delivery tracking
