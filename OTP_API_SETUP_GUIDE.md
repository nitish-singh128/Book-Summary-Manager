# 📧📱 OTP API Setup Guide - Free Services

This guide will help you set up free email and SMS OTP services for your Book Summary Manager application.

## 🚀 Quick Start (Demo Mode)

The application works out-of-the-box in **demo mode** - OTPs are shown in browser alerts for testing purposes. To enable real email and SMS sending, follow the setup instructions below.

---

## 📧 Email OTP Setup - EmailJS (FREE)

**Free Tier**: 200 emails/month

### Step 1: Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### Step 2: Create Email Service
1. In EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions
5. Note your **Service ID** (e.g., `service_bookmanager`)

### Step 3: Create Email Template
1. Go to **Email Templates**
2. Click **Create New Template**
3. Use this template:

```html
Subject: Your OTP Code - {{app_name}}

Hello {{to_name}},

Your verification code is: {{otp_code}}

This code will expire in {{expires_in}}.

Best regards,
{{from_name}}
```

4. Note your **Template ID** (e.g., `template_otp`)

### Step 4: Get Public Key
1. Go to **Account** → **General**
2. Copy your **Public Key**

### Step 5: Update Configuration
In `frontend/assets/js/otp-service.js`, update:

```javascript
this.emailJS = {
    serviceId: 'your_service_id_here',
    templateId: 'your_template_id_here',
    publicKey: 'your_public_key_here'
};
```

---

## 📱 SMS OTP Setup - TextBelt (FREE)

**Free Tier**: 1 SMS per day per phone number

### Option A: TextBelt (Easiest)
- **No signup required** for basic usage
- **1 free SMS per day** per phone number
- Works internationally

**Setup**: No configuration needed! Already configured in the code.

### Option B: Fast2SMS (India) - 100 FREE SMS
1. Go to [Fast2SMS.com](https://www.fast2sms.com/)
2. Sign up and verify your account
3. Go to **Developer API**
4. Copy your **API Key**

Update in `otp-service.js`:
```javascript
fast2sms: {
    url: 'https://www.fast2sms.com/dev/bulkV2',
    apiKey: 'YOUR_FAST2SMS_API_KEY'
}
```

### Option C: Twilio (Premium with Free Trial)
1. Go to [Twilio.com](https://www.twilio.com/)
2. Sign up for free trial ($15 credit)
3. Get your **Account SID** and **Auth Token**
4. Update configuration in `otp-service.js`

---

## 🔧 Alternative Free SMS APIs

### 1. **MSG91** (India)
- **Free**: 100 SMS
- Website: [msg91.com](https://msg91.com/)

### 2. **Nexmo/Vonage**
- **Free**: €2 credit
- Website: [vonage.com](https://www.vonage.com/)

### 3. **SMSGateway.me**
- **Free**: Limited messages
- Website: [smsgateway.me](https://smsgateway.me/)

---

## ⚙️ Configuration Steps

### 1. Update OTP Service Configuration
Edit `frontend/assets/js/otp-service.js`:

```javascript
// Replace these with your actual API keys
this.emailJS = {
    serviceId: 'service_your_id',
    templateId: 'template_your_id', 
    publicKey: 'your_emailjs_public_key'
};

// For Fast2SMS (optional)
this.smsAPIs = {
    fast2sms: {
        url: 'https://www.fast2sms.com/dev/bulkV2',
        apiKey: 'YOUR_FAST2SMS_API_KEY'
    }
};
```

### 2. Test the Setup
1. Register a new user
2. Check your email for OTP
3. Check your phone for SMS OTP
4. Use either OTP to verify

---

## 🎯 Production Recommendations

### For Higher Volume:
1. **Email**: Upgrade EmailJS or use SendGrid, Mailgun
2. **SMS**: Use Twilio, AWS SNS, or regional providers

### Security Best Practices:
1. **Rate Limiting**: Implement on server-side
2. **IP Blocking**: Prevent abuse
3. **OTP Expiry**: Keep at 10 minutes max
4. **Attempt Limits**: Max 3 verification attempts

---

## 🐛 Troubleshooting

### Email Not Sending:
1. Check EmailJS service configuration
2. Verify template parameters match
3. Check browser console for errors
4. Ensure public key is correct

### SMS Not Sending:
1. Check phone number format (+1234567890)
2. Verify API keys are correct
3. Check TextBelt quota (1 per day)
4. Try alternative SMS service

### Demo Mode:
- If APIs aren't configured, system shows OTPs in browser alerts
- Perfect for development and testing
- No external dependencies required

---

## 💡 Tips

1. **Development**: Use demo mode for testing
2. **Staging**: Configure EmailJS only
3. **Production**: Configure both email and SMS
4. **Backup**: Always have fallback methods
5. **Monitoring**: Log OTP send success/failure rates

---

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify API configurations
3. Test with demo mode first
4. Check service provider status pages

**Happy coding!** 🚀 