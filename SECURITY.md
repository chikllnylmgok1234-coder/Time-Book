# Time Book Security Guidelines

## Core Principles

1. **Trust Backend, Not Frontend**
   - Never trust client-side authentication
   - Always verify credentials on server
   - Server must authorize every API call

2. **Encryption in Transit & At Rest**
   - All connections use HTTPS/WSS
   - Sensitive data encrypted in database
   - Passwords hashed with Argon2id

3. **Least Privilege Access**
   - Users only access their own data
   - Admins only have necessary permissions
   - No default admin accounts
   - Role-based access control (RBAC)

4. **Audit Everything**
   - Log all admin actions
   - Log all security events
   - Immutable audit trail
   - Regular audit log review

## OTP Security

### Requirements
- OTP validity: 10 minutes
- OTP length: 6 digits
- Max attempts: 3 per OTP
- Resend cooldown: 60 seconds
- Rate limit: 5 OTP requests per phone per 24 hours

### Server-Side Only
- Generate OTP on backend
- Send OTP via SMS provider (never email display)
- Validate OTP on backend
- Hash OTP in database
- Never return OTP to client

### Abuse Prevention
- Block phone number after too many failed attempts
- Monitor for OTP bombing
- Verify phone provider legitimacy
- Implement CAPTCHA for OTP requests (if needed)

## Password Security

### Requirements
- Minimum 8 characters
- Recommended: 12+ characters
- Mix of uppercase, lowercase, numbers, symbols
- Not in common password list

### Hashing
```javascript
// Use Argon2id with proper parameters
const argon2 = require('argon2');

const hash = await argon2.hash(password, {
  type: argon2.argon2id,
  memoryCost: 19456,      // 19 MB
  timeCost: 2,
  parallelism: 1
});
```

### Never
- Store passwords in plaintext
- Use MD5 or SHA1
- Use salted but single-round hashing
- Log passwords anywhere
- Display password to admins
- Send password via email

## Authentication Flow Security

### Token Management
```
Access Token:
- JWT format
- 15-minute expiration
- Contains: user_id, permissions
- Signed with private key
- Verified on every request

Refresh Token:
- Stored in secure httpOnly cookie
- 7-day expiration
- Only used to get new access token
- Single-use (rotate on refresh)
- Revoked on logout
```

### Session Management
- Track active sessions
- Allow "Sign out all devices"
- Invalidate session on password change
- Expire sessions on inactivity (30 min)
- Verify device fingerprint if needed

## API Security

### Rate Limiting
```
- Login attempts: 5 per 15 minutes per IP
- API requests: 1000 per hour per user
- Message sending: 100 per minute per user
- File uploads: 50 MB per day per user
- OTP requests: 5 per 24 hours per phone
```

### Input Validation
```javascript
// Always validate on server
if (!phoneNumber || !phoneNumber.match(/^\+?[1-9]\d{1,14}$/)) {
  throw new ValidationError('Invalid phone number');
}

// Sanitize text input
const sanitized = DOMPurify.sanitize(userInput);

// Validate file uploads
const allowedMimes = ['image/jpeg', 'image/png', 'video/mp4'];
if (!allowedMimes.includes(file.mimetype)) {
  throw new ValidationError('File type not allowed');
}
```

### CORS & CSRF
```javascript
// Strict CORS
app.use(cors({
  origin: ['https://timebook.app', 'https://admin.timebook.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// CSRF token for state-changing operations
app.post('/api/action', csrfProtection, (req, res) => {
  // Handle POST
});
```

## Data Protection

### User Data
- Delete user data on account deletion request
- Implement GDPR/privacy compliance
- Encrypt personally identifiable information
- Minimize data collection
- Provide data export functionality

### Message Data
- Implement message retention policies
- Allow message deletion (for me / for everyone)
- Automatic message deletion after X days (optional)
- Backup deleted messages separately
- Never expose messages to unauthorized users

### OTP & Passwords
- Hash before storing
- Never log in plaintext
- Never send in emails
- Never display to admins
- Delete from logs after 24 hours

## Admin Security

### Admin Authentication
```javascript
// Separate admin login
POST /api/admin/login
- Email/username
- Password (different from user password)
- 2FA code (TOTP or SMS)

// Admin session
- Shorter timeout: 1 hour
- Requires re-authentication for sensitive actions
- Track all logins
- Alert on unusual activity
```

### Admin Permissions
```javascript
const PERMISSIONS = {
  OWNER: ['*'],  // Full access
  ADMIN: ['users.manage', 'reports.handle', 'groups.moderate', 'system.view'],
  MODERATOR: ['reports.handle', 'users.warn', 'content.remove'],
  SUPPORT: ['tickets.handle', 'users.help']
};

// Check before every admin action
if (!hasPermission(admin, 'users.manage')) {
  throw new AuthorizationError('Insufficient permissions');
}
```

### Admin Actions Audit
```
Every admin action logged:
- Admin ID
- Action type
- Target user/resource
- Timestamp
- IP address
- Reason (if applicable)
- Result (success/failure)

Example:
AdminID: 123
Action: suspend_user
Target: user_456
Reason: Multiple spam reports
Time: 2024-01-15T10:30:00Z
IP: 192.168.1.1
```

## Privacy by Design

### User Privacy Settings
- Last seen: Everyone / Contacts / Nobody
- Online status: Everyone / Contacts / Nobody
- Profile photo: Everyone / Contacts / Nobody
- Status visibility: Everyone / Contacts / Nobody
- Read receipts: On/Off
- Blocked users: Private list

### Status Privacy
- Public: Everyone can see
- Contacts: Only contacts can see
- Private: Only specific users can see
- Anonymous mode: Viewer identity hidden from status owner

### Message Privacy
- Only sender & recipient can read
- No group admin "peek" feature
- No hidden message delivery tracking
- Users control message lifetime

## Secure Development

### Environment Variables
```bash
# .env (never commit)
DB_PASSWORD=xxx
JWT_SECRET=xxx
OTP_API_KEY=xxx
AWS_SECRET=xxx
```

### Dependency Management
```bash
# Check for vulnerabilities
npm audit
npm audit fix

# Update regularly
npm update

# Remove unused dependencies
npm prune
```

### Code Security Checks
```bash
# SAST scanning
npm install -g snyk
snyk test

# Dependency check
dependency-check

# Secret scanning
git-secrets --install
```

## Deployment Security

### Server Hardening
- Disable unnecessary services
- Firewall rules (restrict ports)
- SSH key authentication only
- Regular security patches
- Disable root login
- File permissions (least privilege)

### Database Security
- Strong credentials (32+ char password)
- Network isolation (private subnet)
- Encrypted connections (SSL/TLS)
- Regular backups (encrypted)
- Access logs enabled
- SQL injection prevention (parameterized queries)

### Infrastructure
- DDoS protection (Cloudflare/AWS Shield)
- WAF rules enabled
- SSL/TLS certificates (auto-renewal)
- Logging & monitoring active
- Incident response plan documented

## Incident Response

### Breach Notification
If a data breach occurs:
1. Isolate affected systems
2. Notify affected users within 72 hours
3. Document incident
4. Report to relevant authorities
5. Review and improve security

### Security Updates
- Critical: Deploy within 24 hours
- High: Deploy within 72 hours
- Medium: Deploy within 1 week
- Low: Deploy in regular release

## Compliance

### GDPR (EU)
- User consent for data processing
- Right to data portability
- Right to be forgotten
- Data breach notification

### CCPA (California)
- Transparency about data collection
- Right to delete personal information
- Right to opt-out of sale

### HIPAA (Healthcare, if applicable)
- Encryption of healthcare data
- Access controls
- Audit trails
- Business associate agreements

## Security Checklist

- [ ] All API calls require authentication
- [ ] All data is validated server-side
- [ ] Passwords are hashed (Argon2id)
- [ ] OTP is never stored in plaintext
- [ ] OTP is never returned to client
- [ ] Sessions are properly managed
- [ ] HTTPS/WSS used everywhere
- [ ] Rate limiting implemented
- [ ] Admin actions are logged
- [ ] Admins have no backdoor access
- [ ] Private messages are private
- [ ] Users can delete their data
- [ ] Dependency vulnerabilities are fixed
- [ ] Code is reviewed before deployment
- [ ] Secrets are in environment variables
- [ ] Incident response plan exists
- [ ] Regular security audits performed
- [ ] Privacy policy is comprehensive
- [ ] Terms of service are clear
- [ ] User consent is documented
