/**
 * OTP Service - Send OTP via Email and SMS using free APIs
 * Uses EmailJS for email and TextBelt for SMS
 */
class OTPService {
    constructor() {
        // EmailJS Configuration (Free tier: 200 emails/month)
        this.emailJS = {
            serviceId: 'service_bookmanager',
            templateId: 'template_otp',
            publicKey: 'YOUR_EMAILJS_PUBLIC_KEY' // Replace with your EmailJS public key
        };
        
        // TextBelt API for SMS (Free tier: 1 SMS per day per phone)
        this.textBeltAPI = 'https://textbelt.com/text';
        
        // Alternative SMS APIs (all have free tiers)
        this.smsAPIs = {
            // Twilio (Free trial with $15 credit)
            twilio: {
                url: 'https://api.twilio.com/2010-04-01/Accounts/YOUR_ACCOUNT_SID/Messages.json',
                auth: 'YOUR_TWILIO_AUTH_TOKEN'
            },
            // Fast2SMS (Free tier: 100 SMS)
            fast2sms: {
                url: 'https://www.fast2sms.com/dev/bulkV2',
                apiKey: 'YOUR_FAST2SMS_API_KEY'
            }
        };
        
        this.initEmailJS();
    }
    
    /**
     * Initialize EmailJS
     */
    async initEmailJS() {
        try {
            // Load EmailJS if not already loaded
            if (typeof emailjs === 'undefined') {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
                script.onload = () => {
                    emailjs.init(this.emailJS.publicKey);
                };
                document.head.appendChild(script);
            } else {
                emailjs.init(this.emailJS.publicKey);
            }
        } catch (error) {
            console.error('Failed to initialize EmailJS:', error);
        }
    }
    
    /**
     * Generate a 6-digit OTP
     */
    generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    
    /**
     * Send OTP via Email using EmailJS (Free)
     */
    async sendEmailOTP(email, otp, userDetails = {}) {
        try {
            const templateParams = {
                to_email: email,
                to_name: userDetails.fullName || 'User',
                otp_code: otp,
                app_name: 'Book Summary Manager',
                expires_in: '10 minutes',
                from_name: 'Book Summary Manager Team'
            };
            
            const response = await emailjs.send(
                this.emailJS.serviceId,
                this.emailJS.templateId,
                templateParams
            );
            
            console.log('✅ Email OTP sent successfully:', response);
            return { success: true, response };
            
        } catch (error) {
            console.error('❌ Failed to send email OTP:', error);
            
            // Fallback: Use mailto link for demo purposes
            const subject = encodeURIComponent('Your OTP Code - Book Summary Manager');
            const body = encodeURIComponent(`
Hello ${userDetails.fullName || 'User'},

Your OTP code is: ${otp}

This code will expire in 10 minutes.

Best regards,
Book Summary Manager Team
            `);
            
            const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;
            
            // Show user the OTP in an alert as fallback
            alert(`📧 Email OTP (Demo Mode):\n\nTo: ${email}\nOTP Code: ${otp}\n\nIn production, this would be sent via email.\nFor demo purposes, the OTP is shown here.`);
            
            return { success: true, fallback: true, otp };
        }
    }
    
    /**
     * Send OTP via SMS using TextBelt (Free - 1 SMS per day)
     */
    async sendSMSOTP(phoneNumber, otp, userDetails = {}) {
        try {
            const message = `Your Book Summary Manager OTP is: ${otp}. Valid for 10 minutes. Do not share this code.`;
            
            const response = await fetch(this.textBeltAPI, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone: phoneNumber,
                    message: message,
                    key: 'textbelt' // Free tier key
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                console.log('✅ SMS OTP sent successfully:', result);
                return { success: true, result };
            } else {
                throw new Error(result.error || 'SMS sending failed');
            }
            
        } catch (error) {
            console.error('❌ Failed to send SMS OTP:', error);
            
            // Fallback: Show OTP in alert for demo
            alert(`📱 SMS OTP (Demo Mode):\n\nTo: ${phoneNumber}\nOTP Code: ${otp}\n\nIn production, this would be sent via SMS.\nFor demo purposes, the OTP is shown here.`);
            
            return { success: true, fallback: true, otp };
        }
    }
    
    /**
     * Send OTP via SMS using Fast2SMS (Alternative - 100 free SMS)
     */
    async sendSMSVifast2SMS(phoneNumber, otp, userDetails = {}) {
        try {
            const message = `Your Book Summary Manager OTP is: ${otp}. Valid for 10 minutes.`;
            
            const response = await fetch(this.smsAPIs.fast2sms.url, {
                method: 'POST',
                headers: {
                    'Authorization': this.smsAPIs.fast2sms.apiKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    route: 'otp',
                    variables_values: otp,
                    flash: 0,
                    numbers: phoneNumber.replace('+', '').replace(/\D/g, '') // Remove non-digits
                })
            });
            
            const result = await response.json();
            
            if (result.return) {
                console.log('✅ SMS OTP sent via Fast2SMS:', result);
                return { success: true, result };
            } else {
                throw new Error('Fast2SMS sending failed');
            }
            
        } catch (error) {
            console.error('❌ Fast2SMS failed:', error);
            return this.sendSMSOTP(phoneNumber, otp, userDetails); // Fallback to TextBelt
        }
    }
    
    /**
     * Send OTP to both Email and SMS
     */
    async sendDualOTP(email, phoneNumber, userDetails = {}) {
        const otp = this.generateOTP();
        
        console.log('🚀 Sending OTP to both email and SMS...');
        
        // Send to both email and SMS simultaneously
        const [emailResult, smsResult] = await Promise.all([
            this.sendEmailOTP(email, otp, userDetails),
            this.sendSMSOTP(phoneNumber, otp, userDetails)
        ]);
        
        return {
            otp,
            email: emailResult,
            sms: smsResult,
            success: emailResult.success || smsResult.success
        };
    }
    
    /**
     * Validate OTP format
     */
    validateOTPFormat(otp) {
        return /^\d{6}$/.test(otp);
    }
    
    /**
     * Create OTP data object for storage
     */
    createOTPData(email, phoneNumber, otp, purpose = 'registration') {
        const timestamp = Date.now();
        
        return {
            id: `otp-${timestamp}`,
            email: email,
            phoneNumber: phoneNumber,
            otp: otp,
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
            isUsed: false,
            purpose: purpose,
            isLatest: true,
            attempts: 0,
            maxAttempts: 3
        };
    }
}

// Initialize OTP service
window.otpService = new OTPService(); 