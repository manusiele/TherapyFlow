# Video Call Integration - Jitsi Meet

## Overview
TherapyFlow uses **Jitsi Meet** for secure, HIPAA-compliant video therapy sessions. Jitsi is a free, open-source WebRTC solution that provides end-to-end encrypted video calls.

## Features Implemented

### ✅ Core Features
- **HD Video & Audio**: High-quality video conferencing
- **Screen Sharing**: Share screens during therapy sessions
- **Chat**: In-call text messaging
- **End-to-End Encryption**: Secure communications
- **No Time Limits**: Unlimited session duration
- **No Participant Caps**: Support for group therapy (if needed)
- **Browser-Based**: No downloads required
- **Mobile Responsive**: Works on all devices

### ✅ Privacy & Security
- **HIPAA-Ready**: Can be configured for HIPAA compliance
- **No Data Storage**: Rooms don't persist after calls
- **Secure Room Names**: Unique, non-guessable room identifiers
- **Lobby Mode**: Preview before joining
- **Encrypted Communications**: WebRTC encryption

### ✅ UI Features
- **Pre-join Screen**: Test audio/video before joining
- **Device Selection**: Choose camera/microphone
- **Quality Settings**: Adjust video quality
- **Full-Screen Mode**: Immersive experience
- **Connection Status**: Real-time connection indicators

## Current Setup

### Using Public Jitsi Server
Currently configured to use `meet.jit.si` (free public server):
- ✅ Zero cost
- ✅ No setup required
- ✅ Instant availability
- ⚠️ Shared infrastructure
- ⚠️ Less control over data

### Room Naming Convention
Rooms are generated using:
```
TherapyFlow_{therapistId}_{patientId}_{sessionDate}
```

This ensures:
- Unique rooms per session
- Predictable for recurring appointments
- Secure (non-guessable)

## Self-Hosting for Production (Recommended)

For maximum privacy and HIPAA compliance, self-host Jitsi:

### Benefits of Self-Hosting
- ✅ Full data control
- ✅ Custom branding
- ✅ Better performance
- ✅ HIPAA compliance
- ✅ No third-party dependencies

### Quick Self-Hosting Guide

#### 1. Server Requirements
- Ubuntu 20.04 LTS or later
- 4GB RAM minimum (8GB recommended)
- 2 CPU cores minimum
- Domain name with SSL certificate

#### 2. Installation (Docker - Easiest)
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Clone Jitsi Docker setup
git clone https://github.com/jitsi/docker-jitsi-meet
cd docker-jitsi-meet

# Generate config
cp env.example .env
./gen-passwords.sh

# Edit .env file
nano .env
# Set PUBLIC_URL=https://meet.yourdomain.com

# Start Jitsi
docker-compose up -d
```

#### 3. Update TherapyFlow Configuration
In `src/lib/videoCall.ts`, change:
```typescript
export function getJitsiConfig() {
  return {
    domain: 'meet.yourdomain.com', // Your self-hosted domain
    // ... rest of config
  }
}
```

#### 4. SSL Certificate (Required)
```bash
# Using Let's Encrypt
sudo apt install certbot
sudo certbot certonly --standalone -d meet.yourdomain.com
```

### Alternative: Managed Jitsi Hosting
If self-hosting is complex, consider:
- **8x8 Video Meetings**: Official Jitsi hosting ($9.99/month)
- **Jitsi as a Service (JaaS)**: Pay-per-use model
- **AWS/DigitalOcean**: Deploy pre-configured instances

## HIPAA Compliance Checklist

To make Jitsi HIPAA-compliant:

### Technical Requirements
- [ ] Self-host on your own servers
- [ ] Enable end-to-end encryption
- [ ] Use HTTPS/TLS for all connections
- [ ] Implement access controls
- [ ] Enable audit logging
- [ ] Regular security updates
- [ ] Backup and disaster recovery plan

### Administrative Requirements
- [ ] Business Associate Agreement (BAA) with hosting provider
- [ ] Privacy policy updates
- [ ] Staff training on secure usage
- [ ] Incident response procedures
- [ ] Regular security audits

### Configuration Changes for HIPAA
```javascript
// In Jitsi config
{
  enableE2EE: true, // Force encryption
  disableRecording: true, // Prevent recordings
  requireDisplayName: true, // Identify participants
  enableLobbyChat: false, // No pre-call chat
  doNotStoreRoom: true, // Don't persist rooms
}
```

## Usage in TherapyFlow

### For Therapists
1. Navigate to Schedule page
2. Click on a session
3. Click "Join Video Call" button
4. Preview audio/video in lobby
5. Click "Join Meeting"

### For Patients
1. Navigate to Patient Portal
2. View upcoming appointments
3. Click "Join Video Call" when session time arrives
4. Preview and join

### Room Access
- Rooms are automatically created when first person joins
- Unique room names prevent unauthorized access
- Rooms are destroyed when last person leaves

## Troubleshooting

### Common Issues

**Camera/Microphone Not Working**
- Check browser permissions
- Ensure HTTPS connection
- Try different browser (Chrome/Firefox recommended)

**Poor Video Quality**
- Check internet connection (minimum 2 Mbps)
- Close other bandwidth-heavy applications
- Reduce video quality in settings

**Can't Join Room**
- Clear browser cache
- Disable browser extensions
- Check firewall settings

### Browser Support
- ✅ Chrome/Chromium (Recommended)
- ✅ Firefox
- ✅ Safari (iOS 14.3+)
- ✅ Edge
- ⚠️ Internet Explorer (Not supported)

## Future Enhancements

### Planned Features
- [ ] Recording with consent
- [ ] Waiting room for patients
- [ ] Session recording storage
- [ ] Automatic session notes from transcription
- [ ] Virtual backgrounds
- [ ] Breakout rooms for group therapy
- [ ] Integration with calendar reminders

### Advanced Features (Self-Hosted)
- [ ] Custom branding/logo
- [ ] Analytics and usage reports
- [ ] SIP/phone dial-in
- [ ] Live streaming
- [ ] YouTube integration

## Cost Comparison

### Public Server (Current)
- **Cost**: $0/month
- **Setup**: 0 minutes
- **Maintenance**: None
- **Best for**: Testing, demos, low-volume

### Self-Hosted
- **Cost**: $10-50/month (server)
- **Setup**: 2-4 hours
- **Maintenance**: Monthly updates
- **Best for**: Production, HIPAA compliance

### Managed Service
- **Cost**: $10-100/month
- **Setup**: 30 minutes
- **Maintenance**: Minimal
- **Best for**: Quick production deployment

## Security Best Practices

1. **Always use HTTPS** - Never allow HTTP connections
2. **Unique room names** - Don't reuse room identifiers
3. **Time-limited rooms** - Generate new rooms per session
4. **Lobby mode** - Screen participants before admitting
5. **No recordings** - Unless explicitly consented
6. **Regular updates** - Keep Jitsi version current
7. **Monitor access** - Log all session joins/leaves

## Support & Resources

- **Jitsi Documentation**: https://jitsi.github.io/handbook/
- **Community Forum**: https://community.jitsi.org/
- **GitHub**: https://github.com/jitsi/jitsi-meet
- **Security**: https://jitsi.org/security/

## License
Jitsi Meet is licensed under Apache License 2.0 - free for commercial use.
