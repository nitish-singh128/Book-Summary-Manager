// Registration Manager - Excel Database Version
class RegistrationManager {
    constructor() {
        this.currentStep = 'registration';
        this.userEmail = '';
        this.pendingUserData = null;
        this.resendTimer = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkIfAlreadyLoggedIn();
    }

    async checkIfAlreadyLoggedIn() {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        if (token) {
            try {
                const response = await fetch(`${this.apiBase}/auth/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    window.location.href = 'dashboard.html';
                }
            } catch (error) {
                console.log('Not logged in');
            }
        }
    }

    bindEvents() {
        // Registration form
        const registrationForm = document.getElementById('registrationForm');
        if (registrationForm) {
            registrationForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegistration();
            });
        }

        // OTP form
        const otpForm = document.getElementById('otpForm');
        if (otpForm) {
            otpForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleOTPVerification();
            });
        }

        // Resend OTP button
        const resendOtpBtn = document.getElementById('resendOtpBtn');
        if (resendOtpBtn) {
            resendOtpBtn.addEventListener('click', () => {
                this.handleResendOTP();
            });
        }

        // Back to registration button
        const backToRegister = document.getElementById('backToRegister');
        if (backToRegister) {
            backToRegister.addEventListener('click', () => {
                this.showStep('registration');
            });
        }

        // Go to dashboard button
        const goToDashboard = document.getElementById('goToDashboard');
        if (goToDashboard) {
            goToDashboard.addEventListener('click', () => {
                window.location.href = 'dashboard.html';
            });
        }

        // OTP input formatting
        const otpInput = document.getElementById('otpCode');
        if (otpInput) {
            otpInput.addEventListener('input', (e) => {
                // Only allow numbers
                e.target.value = e.target.value.replace(/\D/g, '');
            });

            otpInput.addEventListener('paste', (e) => {
                e.preventDefault();
                const paste = (e.clipboardData || window.clipboardData).getData('text');
                const numbers = paste.replace(/\D/g, '').substring(0, 6);
                e.target.value = numbers;
            });
        }

        // Real-time validation
        this.bindValidation();
    }

    bindValidation() {
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirmPassword');
        const email = document.getElementById('email');
        const username = document.getElementById('username');
        const phoneNumber = document.getElementById('phoneNumber');

        if (password) {
            password.addEventListener('input', () => this.validatePassword());
        }

        if (confirmPassword) {
            confirmPassword.addEventListener('input', () => this.validatePasswordMatch());
        }

        if (email) {
            email.addEventListener('input', () => this.validateEmail());
        }

        if (username) {
            username.addEventListener('input', () => this.validateUsername());
        }

        if (phoneNumber) {
            phoneNumber.addEventListener('input', () => this.validatePhoneNumber());
        }
    }

    validatePassword() {
        const password = document.getElementById('password');
        const isValid = password.value.length >= 6;
        
        password.classList.toggle('valid', isValid);
        password.classList.toggle('invalid', !isValid && password.value.length > 0);
        
        return isValid;
    }

    validatePasswordMatch() {
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirmPassword');
        const isValid = password.value === confirmPassword.value && confirmPassword.value.length > 0;
        
        confirmPassword.classList.toggle('valid', isValid);
        confirmPassword.classList.toggle('invalid', !isValid && confirmPassword.value.length > 0);
        
        return isValid;
    }

    validateEmail() {
        const email = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(email.value);
        
        email.classList.toggle('valid', isValid);
        email.classList.toggle('invalid', !isValid && email.value.length > 0);
        
        return isValid;
    }

    validateUsername() {
        const username = document.getElementById('username');
        const isValid = username.value.length >= 3;
        
        username.classList.toggle('valid', isValid);
        username.classList.toggle('invalid', !isValid && username.value.length > 0);
        
        return isValid;
    }

    validatePhoneNumber() {
        const phoneNumber = document.getElementById('phoneNumber');
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        const isValid = phoneRegex.test(phoneNumber.value);
        
        phoneNumber.classList.toggle('valid', isValid);
        phoneNumber.classList.toggle('invalid', !isValid && phoneNumber.value.length > 0);
        
        return isValid;
    }

    async handleRegistration() {
        const formData = this.getRegistrationFormData();
        
        // Validate form
        if (!this.validateRegistrationForm(formData)) {
            return;
        }

        this.setButtonLoading('registerBtn', true);
        this.hideMessage('registrationMessage');

        try {
            // Wait for Excel database to be ready
            if (!window.excelDB) {
                throw new Error('Excel database not initialized');
            }
            
            await window.excelDB.waitForInit();

            // Check if user already exists
            const existingUser = window.excelDB.findUser(formData.email) || 
                                 window.excelDB.findUser(formData.username);
            
            if (existingUser) {
                if (existingUser.email === formData.email) {
                    throw new Error('Email already registered');
                } else {
                    throw new Error('Username already taken');
                }
            }

            // Store pending user data
            this.pendingUserData = formData;
            this.userEmail = formData.email;

            // Generate OTP and send to both email and SMS
            await window.excelDB.generateOTP(formData.email, formData.phoneNumber, 'registration', {
                fullName: formData.fullName
            });
            
            this.showMessage('registrationMessage', 
                'OTP sent! Check your email and SMS for the 6-digit verification code.', 'success');
            
            setTimeout(() => {
                this.showStep('otp');
                this.startResendTimer();
            }, 1500);

        } catch (error) {
            console.error('Registration error:', error);
            this.showMessage('registrationMessage', error.message, 'error');
        } finally {
            this.setButtonLoading('registerBtn', false);
        }
    }

    async handleOTPVerification() {
        const otpCode = document.getElementById('otpCode').value.trim();

        if (!otpCode || otpCode.length !== 6) {
            this.showMessage('otpMessage', 'Please enter a valid 6-digit OTP code.', 'error');
            return;
        }

        if (!this.pendingUserData) {
            this.showMessage('otpMessage', 'Registration data not found. Please restart registration.', 'error');
            return;
        }

        this.setButtonLoading('verifyBtn', true);
        this.hideMessage('otpMessage');

        try {
            // Verify OTP
            const isValidOTP = await window.excelDB.verifyOTP(this.userEmail, otpCode, 'registration');

            if (!isValidOTP) {
                this.showMessage('otpMessage', 'Invalid or expired OTP code.', 'error');
                return;
            }

            // Create user in Excel database
            const newUser = await window.excelDB.createUser(this.pendingUserData);

            // Store user data for session
            localStorage.setItem('userData', JSON.stringify(newUser));
            localStorage.setItem('isAuthenticated', 'true');

            this.showMessage('otpMessage', 'Registration completed successfully! Database updated in project folder.', 'success');
            
            setTimeout(() => {
                this.showStep('success');
            }, 1500);

        } catch (error) {
            console.error('OTP verification error:', error);
            this.showMessage('otpMessage', error.message, 'error');
        } finally {
            this.setButtonLoading('verifyBtn', false);
        }
    }

    async handleResendOTP() {
        if (!this.userEmail) {
            this.showMessage('otpMessage', 'Email not found. Please restart registration.', 'error');
            return;
        }

        if (!this.pendingUserData) {
            this.showMessage('otpMessage', 'Registration data not found. Please restart registration.', 'error');
            return;
        }

        this.setButtonLoading('resendOtpBtn', true);

        try {
            // Generate new OTP and send to both email and SMS
            await window.excelDB.generateOTP(this.userEmail, this.pendingUserData.phoneNumber, 'registration', {
                fullName: this.pendingUserData.fullName
            });
            
            this.showMessage('otpMessage', 'New OTP sent! Check your email and SMS for the new 6-digit code.', 'success');
            this.startResendTimer();

        } catch (error) {
            console.error('Resend OTP error:', error);
            this.showMessage('otpMessage', error.message, 'error');
        } finally {
            this.setButtonLoading('resendOtpBtn', false);
        }
    }

    getRegistrationFormData() {
        return {
            fullName: document.getElementById('fullName').value.trim(),
            username: document.getElementById('username').value.trim(),
            email: document.getElementById('email').value.trim(),
            phoneNumber: document.getElementById('phoneNumber').value.trim(),
            password: document.getElementById('password').value,
            confirmPassword: document.getElementById('confirmPassword').value,
            credentialLevel: document.getElementById('credentialLevel').value
        };
    }

    validateRegistrationForm(data) {
        let isValid = true;

        // Check all fields are filled
        if (!data.fullName || !data.username || !data.email || !data.phoneNumber || !data.password || !data.confirmPassword || !data.credentialLevel) {
            this.showMessage('registrationMessage', 'Please fill in all fields including phone number and credential level.', 'error');
            return false;
        }

        // Validate email format
        if (!this.validateEmail()) {
            this.showMessage('registrationMessage', 'Please enter a valid email address.', 'error');
            isValid = false;
        }

        // Validate username length
        if (!this.validateUsername()) {
            this.showMessage('registrationMessage', 'Username must be at least 3 characters long.', 'error');
            isValid = false;
        }

        // Validate phone number format
        if (!this.validatePhoneNumber()) {
            this.showMessage('registrationMessage', 'Please enter a valid phone number with country code.', 'error');
            isValid = false;
        }

        // Validate password length
        if (!this.validatePassword()) {
            this.showMessage('registrationMessage', 'Password must be at least 6 characters long.', 'error');
            isValid = false;
        }

        // Validate password match
        if (!this.validatePasswordMatch()) {
            this.showMessage('registrationMessage', 'Passwords do not match.', 'error');
            isValid = false;
        }

        return isValid;
    }

    showStep(step) {
        // Hide all steps
        const steps = ['registrationStep', 'otpStep', 'successStep'];
        steps.forEach(stepId => {
            const element = document.getElementById(stepId);
            if (element) {
                element.style.display = 'none';
            }
        });

        // Show current step
        const currentStepElement = document.getElementById(`${step}Step`);
        if (currentStepElement) {
            currentStepElement.style.display = 'block';
        }

        this.currentStep = step;

        // Update OTP instructions
        if (step === 'otp' && this.userEmail && this.pendingUserData) {
            const instructions = document.getElementById('otpInstructions');
            if (instructions) {
                instructions.textContent = `We've sent a 6-digit code to ${this.userEmail} and ${this.pendingUserData.phoneNumber}`;
            }
        }
    }

    startResendTimer() {
        const resendBtn = document.getElementById('resendOtpBtn');
        const resendTimer = document.getElementById('resendTimer');
        const timerCount = document.getElementById('timerCount');
        
        if (!resendBtn || !resendTimer || !timerCount) return;

        let seconds = 60;
        resendBtn.style.display = 'none';
        resendTimer.style.display = 'block';

        this.resendTimer = setInterval(() => {
            seconds--;
            timerCount.textContent = seconds;

            if (seconds <= 0) {
                clearInterval(this.resendTimer);
                resendBtn.style.display = 'block';
                resendTimer.style.display = 'none';
            }
        }, 1000);
    }

    setButtonLoading(buttonId, isLoading) {
        const button = document.getElementById(buttonId);
        if (!button) return;

        const btnText = button.querySelector('.btn-text');
        const btnLoader = button.querySelector('.btn-loader');

        if (btnText && btnLoader) {
            if (isLoading) {
                btnText.style.display = 'none';
                btnLoader.style.display = 'flex';
                button.disabled = true;
            } else {
                btnText.style.display = 'block';
                btnLoader.style.display = 'none';
                button.disabled = false;
            }
        } else {
            // Fallback for buttons without loader structure
            if (isLoading) {
                button.disabled = true;
                button.style.opacity = '0.6';
            } else {
                button.disabled = false;
                button.style.opacity = '1';
            }
        }
    }

    showMessage(elementId, message, type = 'error') {
        const element = document.getElementById(elementId);
        if (!element) return;

        element.textContent = message;
        element.className = `${type}-message`;
        element.style.display = 'block';

        // Auto-hide success messages
        if (type === 'success') {
            setTimeout(() => {
                this.hideMessage(elementId);
            }, 3000);
        }
    }

    hideMessage(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = 'none';
            element.textContent = '';
        }
    }
}

// Initialize registration manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.registrationManager = new RegistrationManager();
});

// Handle form submission on Enter key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const activeForm = document.querySelector('.auth-step:not([style*="display: none"]) form');
        if (activeForm) {
            e.preventDefault();
            activeForm.dispatchEvent(new Event('submit'));
        }
    }
}); 