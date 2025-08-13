// Excel Database Manager - Frontend Only
// Uses SheetJS library for Excel operations

class ExcelDatabaseManager {
    constructor() {
        this.dbPath = './database/users.xlsx';
        this.dbName = 'users.xlsx';
        this.users = [];
        this.sessions = [];
        this.otps = [];
        this.isInitialized = false;
        this.init();
    }

    async init() {
        try {
            // Load existing data from localStorage as backup
            this.loadFromStorage();
            
            // Try to load from existing Excel file if available
            await this.loadExcelDatabase();
            
            // Initialize with demo user if no users exist
            if (this.users.length === 0) {
                this.createDemoUser();
            }
            
            this.isInitialized = true;
            console.log('📊 Excel Database initialized successfully');
            console.log(`Users loaded: ${this.users.length}`);
            
        } catch (error) {
            console.error('Database initialization error:', error);
            // Fallback to demo user
            this.createDemoUser();
            this.isInitialized = true;
        }
    }

    createDemoUser() {
        // Create admin demo user
        const demoAdmin = {
            id: 'demo-admin-001',
            username: 'Admin',
            email: 'admin@booksummary.com',
            passwordHash: this.hashPassword('Admin'),
            fullName: 'Administrator',
            role: 'admin',
            createdAt: new Date().toISOString(),
            lastLogin: '',
            isActive: true,
            isVerified: true,
            favoriteGenres: ['Self-Help', 'Business', 'Technology'],
            booksRead: 0,
            bio: 'Admin account for Book Summary Manager',
            theme: 'light',
            notifications: true,
            autoSave: true,
            permissions: ['create', 'read', 'update', 'delete', 'manage_users', 'export_data', 'system_settings']
        };
        
        // Create regular user demo account
        const demoUser = {
            id: 'demo-user-001',
            username: 'User',
            email: 'user@booksummary.com',
            passwordHash: this.hashPassword('User'),
            fullName: 'Regular User',
            role: 'user',
            createdAt: new Date().toISOString(),
            lastLogin: '',
            isActive: true,
            isVerified: true,
            favoriteGenres: ['Self-Help', 'Fiction'],
            booksRead: 0,
            bio: 'Regular user account for Book Summary Manager',
            theme: 'light',
            notifications: true,
            autoSave: true,
            permissions: ['create', 'read', 'update'] // Limited permissions
        };

        // Create Diamond user (Premium tier - highest privileges after admin)
        const demoDiamond = {
            id: 'demo-diamond-001',
            username: 'Diamond',
            email: 'diamond@booksummary.com',
            passwordHash: this.hashPassword('Diamond'),
            fullName: 'Diamond Member',
            role: 'diamond',
            createdAt: new Date().toISOString(),
            lastLogin: '',
            isActive: true,
            isVerified: true,
            favoriteGenres: ['Self-Help', 'Business', 'Technology', 'Science'],
            booksRead: 0,
            bio: 'Diamond tier member with premium access',
            theme: 'dark',
            notifications: true,
            autoSave: true,
            permissions: ['create', 'read', 'update', 'delete', 'export_personal_data', 'advanced_search', 'bulk_operations', 'premium_features']
        };

        // Create Gold user (Mid-tier privileges)
        const demoGold = {
            id: 'demo-gold-001',
            username: 'Gold',
            email: 'gold@booksummary.com',
            passwordHash: this.hashPassword('Gold'),
            fullName: 'Gold Member',
            role: 'gold',
            credentialLevel: 'gold',
            createdAt: new Date().toISOString(),
            lastLogin: '',
            isActive: true,
            isVerified: true,
            favoriteGenres: ['Self-Help', 'Business', 'Fiction'],
            booksRead: 0,
            bio: 'Gold tier member with enhanced features',
            theme: 'light',
            notifications: true,
            autoSave: true,
            permissions: ['create', 'read', 'update', 'delete', 'export_personal_data', 'advanced_search']
        };

        // Create Silver user (Basic premium privileges)
        const demoSilver = {
            id: 'demo-silver-001',
            username: 'Silver',
            email: 'silver@booksummary.com',
            passwordHash: this.hashPassword('Silver'),
            fullName: 'Silver Member',
            role: 'silver',
            credentialLevel: 'silver',
            createdAt: new Date().toISOString(),
            lastLogin: '',
            isActive: true,
            isVerified: true,
            favoriteGenres: ['Self-Help', 'Fiction'],
            booksRead: 0,
            bio: 'Silver tier member with basic premium features',
            theme: 'light',
            notifications: true,
            autoSave: true,
            permissions: ['create', 'read', 'update', 'export_personal_data']
        };

        // Create Platinum user (Highest tier privileges)
        const demoPlatinum = {
            id: 'demo-platinum-001',
            username: 'Platinum',
            email: 'platinum@booksummary.com',
            passwordHash: this.hashPassword('Platinum'),
            fullName: 'Platinum Member',
            role: 'platinum',
            credentialLevel: 'platinum',
            createdAt: new Date().toISOString(),
            lastLogin: '',
            isActive: true,
            isVerified: true,
            favoriteGenres: ['Self-Help', 'Business', 'Technology', 'Science', 'Leadership'],
            booksRead: 0,
            bio: 'Platinum tier member with maximum premium access and priority support',
            theme: 'dark',
            notifications: true,
            autoSave: true,
            permissions: ['create', 'read', 'update', 'delete', 'export_personal_data', 'advanced_search', 'bulk_operations', 'premium_features', 'priority_support']
        };
        
        this.users.push(demoAdmin);
        this.users.push(demoUser);
        this.users.push(demoDiamond);
        this.users.push(demoGold);
        this.users.push(demoSilver);
        this.users.push(demoPlatinum);
        
        // Update database with demo users
        this.updateDatabase();
        
        console.log('👤 Demo accounts created:');
        console.log('   - Admin: "Admin/Admin" (Full system access)');
        console.log('   - Diamond: "Diamond/Diamond" (Premium tier - highest user privileges)');
        console.log('   - Platinum: "Platinum/Platinum" (Maximum premium access with priority support)');
        console.log('   - Gold: "Gold/Gold" (Mid-tier privileges)');
        console.log('   - Silver: "Silver/Silver" (Basic premium privileges)');
        console.log('   - User: "User/User" (Standard access)');
        console.log('📊 Database initialized with all user types');
    }

    // Simple password hashing for demo (in real app, use proper hashing)
    hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return 'demo_hash_' + Math.abs(hash).toString();
    }

    // Verify password against hash
    verifyPassword(password, hash) {
        return this.hashPassword(password) === hash;
    }

    // Generate OTP and send to both email and SMS
    async generateOTP(email, phoneNumber, purpose = 'registration', userDetails = {}) {
        const timestamp = Date.now();
        
        // Remove any existing OTP for this email (keep only latest)
        this.otps = this.otps.filter(existingOtp => existingOtp.email !== email);
        
        // Use OTP service to send to both email and SMS
        let otpResult;
        if (window.otpService) {
            otpResult = await window.otpService.sendDualOTP(email, phoneNumber, userDetails);
        } else {
            // Fallback: generate OTP manually
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            alert(`📧📱 OTP (Demo Mode):\n\nEmail: ${email}\nPhone: ${phoneNumber}\nOTP Code: ${otp}\n\nIn production, this would be sent via email and SMS.`);
            otpResult = { otp, success: true, fallback: true };
        }
        
        const otpData = {
            id: `otp-${timestamp}`,
            email: email,
            phoneNumber: phoneNumber,
            otp: otpResult.otp,
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
            isUsed: false,
            purpose: purpose,
            isLatest: true,
            emailSent: otpResult.email?.success || false,
            smsSent: otpResult.sms?.success || false
        };

        // Store OTP (only latest one per email)
        this.otps.push(otpData);
        
        // Update database with new OTP
        await this.updateDatabase();

        // Create filename first
        const otpFileName = `otp_${email.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}.txt`;

        // Create OTP file content for project folder
        const otpContent = `=== BOOK SUMMARY MANAGER OTP ===
To: ${email}
OTP Code: ${otp}
Generated: ${new Date().toLocaleString()}
Expires: ${new Date(Date.now() + 10 * 60 * 1000).toLocaleString()}
Purpose: ${purpose}
This code will expire in 10 minutes.

LATEST OTP: This is the most recent OTP for ${email}
Previous OTPs for this email are now invalid.

SAVE THIS FILE TO PROJECT FOLDER:
C:\\Users\\2363413\\cpp_stl_project\\otp_files\\${otpFileName}

INSTRUCTIONS:
1. This file was downloaded to your Downloads folder
2. Cut/Copy this file from Downloads
3. Navigate to: C:\\Users\\2363413\\cpp_stl_project\\otp_files\\
4. Paste the file there
5. Use the OTP code above for verification

================================`;
        
        // Store OTP file content in localStorage as backup
        const otpFiles = JSON.parse(localStorage.getItem('otpFiles') || '{}');
        otpFiles[otpFileName] = otpContent;
        localStorage.setItem('otpFiles', JSON.stringify(otpFiles));

        // Create and download actual file for project folder
        const blob = new Blob([otpContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        // Auto-download the OTP file with project folder naming
        const link = document.createElement('a');
        link.href = url;
        link.download = otpFileName; // Use exact project folder filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        // Show OTP directly in console
        console.log(`🔑 OTP CODE: ${otp} (expires in 10 minutes)`);
        console.log(`📄 File saved: ${otpFileName}`);

        // Show OTP directly and prominently
        alert(`🔑 YOUR OTP CODE: ${otp}\n\n⏰ Expires in 10 minutes\n📧 For: ${email}\n\n📄 Also saved as file: ${otpFileName}\n(Optional: Move from Downloads to project otp_files folder)\n\n💡 Just copy the OTP code above!`);

        return otpData;
    }

    // Verify OTP (only latest OTP per email is valid)
    async verifyOTP(email, otp, purpose = 'registration') {
        // Find the latest OTP for this email
        const otpRecord = this.otps.find(record => 
            record.email === email && 
            record.otp === otp && 
            record.purpose === purpose && 
            !record.isUsed && 
            record.isLatest === true &&
            new Date(record.expiresAt) > new Date()
        );

        if (otpRecord) {
            // Mark as used and remove latest flag
            otpRecord.isUsed = true;
            otpRecord.isLatest = false;
            
            // Update database with used OTP
            await this.updateDatabase();
            
            console.log(`✅ OTP verified successfully for ${email}`);
            console.log(`🗑️  OTP marked as used and database updated`);
            
            return true;
        }
        
        console.log(`❌ OTP verification failed for ${email}`);
        console.log(`💡 Possible reasons: expired, already used, or not the latest OTP`);
        return false;
    }

    // Create new user
    async createUser(userData) {
        // Check if user already exists
        const existingEmail = this.users.find(user => user.email === userData.email);
        const existingUsername = this.users.find(user => user.username === userData.username);

        if (existingEmail) {
            throw new Error('Email already registered');
        }
        if (existingUsername) {
            throw new Error('Username already taken');
        }

        // Map credential level to role and set permissions
        let role = 'user';
        let permissions = ['create', 'read', 'update'];
        
        if (userData.credentialLevel === 'platinum') {
            role = 'platinum';
            permissions = ['create', 'read', 'update', 'delete', 'export_personal_data', 'advanced_search', 'bulk_operations', 'premium_features', 'priority_support'];
        } else if (userData.credentialLevel === 'gold') {
            role = 'gold';
            permissions = ['create', 'read', 'update', 'delete', 'export_personal_data', 'advanced_search'];
        } else if (userData.credentialLevel === 'silver') {
            role = 'silver';
            permissions = ['create', 'read', 'update', 'export_personal_data'];
        }

        const newUser = {
            id: `user-${Date.now()}`,
            username: userData.username,
            email: userData.email,
            phoneNumber: userData.phoneNumber,
            passwordHash: this.hashPassword(userData.password),
            fullName: userData.fullName,
            role: role,
            credentialLevel: userData.credentialLevel,
            createdAt: new Date().toISOString(),
            lastLogin: '',
            isActive: true,
            isVerified: true,
            favoriteGenres: [],
            booksRead: 0,
            bio: userData.bio || '',
            theme: 'light',
            notifications: true,
            autoSave: true,
            permissions: permissions
        };

        this.users.push(newUser);
        
        // Update database immediately
        await this.updateDatabase();
        
        console.log(`✅ User registered and database updated: ${newUser.username}`);
        console.log(`📊 Total users in database: ${this.users.length}`);
        
        return newUser;
    }

    // Find user by username or email
    findUser(usernameOrEmail) {
        return this.users.find(user => 
            user.username === usernameOrEmail || 
            user.email === usernameOrEmail
        );
    }

    // Authenticate user
    async authenticateUser(usernameOrEmail, password) {
        const user = this.findUser(usernameOrEmail);
        if (!user) {
            return null;
        }

        if (!user.isActive) {
            throw new Error('Account is deactivated');
        }

        if (!user.isVerified) {
            throw new Error('Account not verified');
        }

        if (this.verifyPassword(password, user.passwordHash)) {
            // Update last login
            user.lastLogin = new Date().toISOString();
            
            // Update database with login time
            await this.updateDatabase();
            
            console.log(`✅ User logged in: ${user.username} (${user.role})`);
            console.log(`🕐 Last login updated: ${user.lastLogin}`);
            
            // Return user without password hash
            const { passwordHash, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }

        return null;
    }

    // Delete all registered user accounts (keep demo accounts)
    async deleteAllRegisteredUsers() {
        try {
            const demoUserIds = ['demo-admin-001', 'demo-user-001', 'demo-diamond-001', 'demo-gold-001', 'demo-silver-001', 'demo-platinum-001'];
            
            // Count users before deletion
            const beforeCount = this.users.length;
            const registeredUsers = this.users.filter(user => !demoUserIds.includes(user.id));
            
            // Keep only demo users
            this.users = this.users.filter(user => demoUserIds.includes(user.id));
            
            // Clear all OTPs
            this.otps = [];
            
            // Clear sessions for deleted users
            this.sessions = this.sessions.filter(session => {
                const user = this.users.find(u => u.id === session.userId);
                return user && demoUserIds.includes(user.id);
            });
            
            // Update database
            await this.updateDatabase();
            
            const afterCount = this.users.length;
            const deletedCount = beforeCount - afterCount;
            
            console.log(`🗑️ Deleted ${deletedCount} registered user accounts`);
            console.log(`📊 Remaining users: ${afterCount} (demo accounts only)`);
            console.log(`🧹 Cleared ${registeredUsers.length} user sessions and all OTPs`);
            
            return {
                success: true,
                deletedCount,
                remainingCount: afterCount,
                deletedUsers: registeredUsers.map(u => ({ username: u.username, email: u.email }))
            };
            
        } catch (error) {
            console.error('❌ Error deleting registered users:', error);
            return { success: false, error: error.message };
        }
    }

    // Delete ALL users including demo accounts (nuclear option)
    async deleteAllUsers() {
        try {
            const beforeCount = this.users.length;
            
            // Clear everything
            this.users = [];
            this.otps = [];
            this.sessions = [];
            
            // Recreate demo users
            this.createDemoUser();
            
            const afterCount = this.users.length;
            const deletedCount = beforeCount - afterCount;
            
            console.log(`🗑️ Deleted ALL users and recreated demo accounts`);
            console.log(`📊 Users deleted: ${deletedCount}, Demo users recreated: ${afterCount}`);
            
            return {
                success: true,
                deletedCount,
                remainingCount: afterCount,
                message: 'All users deleted and demo accounts recreated'
            };
            
        } catch (error) {
            console.error('❌ Error deleting all users:', error);
            return { success: false, error: error.message };
        }
    }

    // Get user statistics
    getUserStats() {
        const demoUserIds = ['demo-admin-001', 'demo-user-001', 'demo-diamond-001', 'demo-gold-001', 'demo-silver-001', 'demo-platinum-001'];
        
        const totalUsers = this.users.length;
        const demoUsers = this.users.filter(user => demoUserIds.includes(user.id)).length;
        const registeredUsers = totalUsers - demoUsers;
        
        const roleStats = {};
        this.users.forEach(user => {
            roleStats[user.role] = (roleStats[user.role] || 0) + 1;
        });
        
        return {
            total: totalUsers,
            registered: registeredUsers,
            demo: demoUsers,
            roles: roleStats,
            activeOTPs: this.otps.filter(otp => !otp.isUsed && new Date(otp.expiresAt) > new Date()).length,
            totalOTPs: this.otps.length,
            sessions: this.sessions.length
        };
    }

    // Update database (automatically create Excel file)
    async updateDatabase() {
        try {
            // Create database data structure
            const databaseData = {
                users: this.users,
                sessions: this.sessions,
                otps: this.otps, // Keep all OTPs for worksheet
                lastUpdated: new Date().toISOString()
            };

            // Save to localStorage as backup
            localStorage.setItem('localExcelDatabase', JSON.stringify(databaseData));

            // Automatically create/update Excel database file
            await this.createExcelDatabase();

            console.log(`💾 Database updated: ${this.users.length} users, ${this.getActiveOTPCount()} active OTPs`);
            console.log(`🕐 Last updated: ${databaseData.lastUpdated}`);
            console.log(`📊 Excel database auto-updated`);
            
            return true;

        } catch (error) {
            console.error('Error updating database:', error);
            return false;
        }
    }

    // Create Excel database automatically (no user prompts)
    async createExcelDatabase() {
        try {
            // Check if SheetJS is available for Excel generation
            if (typeof XLSX !== 'undefined') {
                // Create Excel workbook
                const wb = XLSX.utils.book_new();

                // Users sheet
                const usersData = this.users.map(user => ({
                    ID: user.id,
                    Username: user.username,
                    Email: user.email,
                    PasswordHash: user.passwordHash,
                    FullName: user.fullName,
                    Role: user.role,
                    CreatedAt: user.createdAt,
                    LastLogin: user.lastLogin,
                    IsActive: user.isActive,
                    IsVerified: user.isVerified,
                    FavoriteGenres: user.favoriteGenres.join(','),
                    BooksRead: user.booksRead,
                    Bio: user.bio,
                    Theme: user.theme,
                    Notifications: user.notifications,
                    AutoSave: user.autoSave
                }));
                const usersSheet = XLSX.utils.json_to_sheet(usersData);
                XLSX.utils.book_append_sheet(wb, usersSheet, "Users");

                // Sessions sheet
                const sessionsData = this.sessions.map(session => ({
                    ID: session.id,
                    UserID: session.userId,
                    Token: session.token,
                    CreatedAt: session.createdAt,
                    ExpiresAt: session.expiresAt,
                    IsActive: session.isActive,
                    EndedAt: session.endedAt || ''
                }));
                const sessionsSheet = XLSX.utils.json_to_sheet(sessionsData);
                XLSX.utils.book_append_sheet(wb, sessionsSheet, "Sessions");

                // OTP sheet - all OTPs with latest flag
                const otpData = this.otps.map(otp => ({
                    ID: otp.id,
                    Email: otp.email,
                    OTP: otp.otp,
                    CreatedAt: otp.createdAt,
                    ExpiresAt: otp.expiresAt,
                    IsUsed: otp.isUsed,
                    Purpose: otp.purpose,
                    IsLatest: otp.isLatest || false
                }));
                const otpSheet = XLSX.utils.json_to_sheet(otpData);
                XLSX.utils.book_append_sheet(wb, otpSheet, "OTP");

                // Store Excel structure in memory for the database folder
                const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
                const base64Excel = btoa(String.fromCharCode(...new Uint8Array(excelBuffer)));
                
                // Store in localStorage for database folder
                localStorage.setItem('projectExcelDatabase', base64Excel);
                localStorage.setItem('projectExcelDatabaseInfo', JSON.stringify({
                    filename: 'users_database.xlsx',
                    lastUpdated: new Date().toISOString(),
                    users: this.users.length,
                    sessions: this.sessions.length,
                    otps: this.otps.length
                }));

                console.log(`📊 Excel database created in memory: users_database.xlsx`);
                console.log(`📁 Ready for project folder: C:\\Users\\2363413\\cpp_stl_project\\database\\`);
                
                return true;
            } else {
                console.log(`⚠️  SheetJS not available, Excel database not created`);
                return false;
            }

        } catch (error) {
            console.error('Error creating Excel database:', error);
            return false;
        }
    }

    // Save database to project folder (create actual Excel file)
    async saveToProjectFolder() {
        try {
            // Check if SheetJS is available for Excel generation
            if (typeof XLSX !== 'undefined') {
                // Create Excel workbook
                const wb = XLSX.utils.book_new();

                // Users sheet
                const usersData = this.users.map(user => ({
                    ID: user.id,
                    Username: user.username,
                    Email: user.email,
                    PasswordHash: user.passwordHash,
                    FullName: user.fullName,
                    Role: user.role,
                    CreatedAt: user.createdAt,
                    LastLogin: user.lastLogin,
                    IsActive: user.isActive,
                    IsVerified: user.isVerified,
                    FavoriteGenres: user.favoriteGenres.join(','),
                    BooksRead: user.booksRead,
                    Bio: user.bio,
                    Theme: user.theme,
                    Notifications: user.notifications,
                    AutoSave: user.autoSave
                }));
                const usersSheet = XLSX.utils.json_to_sheet(usersData);
                XLSX.utils.book_append_sheet(wb, usersSheet, "Users");

                // Sessions sheet
                const sessionsData = this.sessions.map(session => ({
                    ID: session.id,
                    UserID: session.userId,
                    Token: session.token,
                    CreatedAt: session.createdAt,
                    ExpiresAt: session.expiresAt,
                    IsActive: session.isActive,
                    EndedAt: session.endedAt || ''
                }));
                const sessionsSheet = XLSX.utils.json_to_sheet(sessionsData);
                XLSX.utils.book_append_sheet(wb, sessionsSheet, "Sessions");

                // OTP sheet - all OTPs with latest flag
                const otpData = this.otps.map(otp => ({
                    ID: otp.id,
                    Email: otp.email,
                    OTP: otp.otp,
                    CreatedAt: otp.createdAt,
                    ExpiresAt: otp.expiresAt,
                    IsUsed: otp.isUsed,
                    Purpose: otp.purpose,
                    IsLatest: otp.isLatest || false
                }));
                const otpSheet = XLSX.utils.json_to_sheet(otpData);
                XLSX.utils.book_append_sheet(wb, otpSheet, "OTP");

                // Generate Excel file
                const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
                const blob = new Blob([excelBuffer], { 
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
                });

                // Auto-download Excel file for database folder
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'users_database.xlsx';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);

                console.log(`📊 Excel database created: users_database.xlsx`);
                console.log(`📁 MOVE TO: C:\\Users\\2363413\\cpp_stl_project\\database\\users_database.xlsx`);
                console.log(`📈 Contains ${this.users.length} users, ${this.sessions.length} sessions, ${this.otps.length} OTPs`);
                
                return true;
            } else {
                // Fallback to JSON if SheetJS not available
                const databaseContent = {
                    users: this.users,
                    sessions: this.sessions,
                    otps: this.otps,
                    lastUpdated: new Date().toISOString(),
                    version: "1.0",
                    projectPath: "C:\\Users\\2363413\\cpp_stl_project\\database\\users_database.json"
                };

                // Store database content for manual export
                localStorage.setItem('projectDatabaseContent', JSON.stringify(databaseContent, null, 2));

                console.log(`💾 Database structure updated in memory (SheetJS not available)`);
                console.log(`📂 Project path: C:\\Users\\2363413\\cpp_stl_project\\database\\`);
                
                return true;
            }

        } catch (error) {
            console.error('Error creating Excel database:', error);
            return false;
        }
    }

    // Update Excel structure in memory (no file downloads)
    updateExcelStructure() {
        const excelStructure = {
            users: this.users.map(user => ({
                ID: user.id,
                Username: user.username,
                Email: user.email,
                PasswordHash: user.passwordHash,
                FullName: user.fullName,
                Role: user.role,
                CreatedAt: user.createdAt,
                LastLogin: user.lastLogin,
                IsActive: user.isActive,
                IsVerified: user.isVerified,
                FavoriteGenres: user.favoriteGenres.join(','),
                BooksRead: user.booksRead,
                Bio: user.bio,
                Theme: user.theme,
                Notifications: user.notifications,
                AutoSave: user.autoSave
            })),
            sessions: this.sessions.map(session => ({
                ID: session.id,
                UserID: session.userId,
                Token: session.token,
                CreatedAt: session.createdAt,
                ExpiresAt: session.expiresAt,
                IsActive: session.isActive,
                EndedAt: session.endedAt || ''
            })),
            otp: this.otps.map(otp => ({
                ID: otp.id,
                Email: otp.email,
                OTP: otp.otp,
                CreatedAt: otp.createdAt,
                ExpiresAt: otp.expiresAt,
                IsUsed: otp.isUsed,
                Purpose: otp.purpose,
                IsLatest: otp.isLatest || false
            }))
        };

        // Store Excel structure in localStorage
        localStorage.setItem('excelStructure', JSON.stringify(excelStructure));
        
        console.log(`📊 Excel structure updated in memory`);
        console.log(`   Users: ${excelStructure.users.length}`);
        console.log(`   Sessions: ${excelStructure.sessions.length}`);
        console.log(`   OTPs: ${excelStructure.otp.length} (${this.getActiveOTPCount()} active)`);
    }

    // Get count of active OTPs
    getActiveOTPCount() {
        return this.otps.filter(otp => 
            !otp.isUsed && 
            otp.isLatest === true && 
            new Date(otp.expiresAt) > new Date()
        ).length;
    }

    // Get OTP files in project structure
    getOTPFiles() {
        const otpFiles = JSON.parse(localStorage.getItem('otpFiles') || '{}');
        return otpFiles;
    }

    // View specific OTP file content
    viewOTPFile(fileName) {
        const otpFiles = this.getOTPFiles();
        return otpFiles[fileName] || null;
    }

    // List all OTP files in project
    listOTPFiles() {
        const otpFiles = this.getOTPFiles();
        const fileList = Object.keys(otpFiles);
        
        console.log(`\n📁 === OTP FILES IN PROJECT ===`);
        console.log(`📂 Location: ./otp_files/`);
        console.log(`📄 Total files: ${fileList.length}`);
        
        fileList.forEach((fileName, index) => {
            console.log(`${index + 1}. ${fileName}`);
        });
        
        if (fileList.length === 0) {
            console.log(`📭 No OTP files found`);
        }
        
        console.log(`===============================\n`);
        return fileList;
    }

    // Get database structure for inspection
    getDatabaseStructure() {
        const structure = JSON.parse(localStorage.getItem('excelStructure') || '{}');
        
        console.log(`\n📊 === DATABASE STRUCTURE ===`);
        console.log(`📈 Users: ${structure.users?.length || 0}`);
        console.log(`🔐 Sessions: ${structure.sessions?.length || 0}`);
        console.log(`🔑 OTPs: ${structure.otp?.length || 0}`);
        console.log(`⏰ Last Updated: ${JSON.parse(localStorage.getItem('localExcelDatabase') || '{}').lastUpdated || 'Never'}`);
        console.log(`=============================\n`);
        
        return structure;
    }

    // Load database from project folder or localStorage
    async loadExcelDatabase() {
        try {
            // First try to load from localStorage (most recent)
            const stored = localStorage.getItem('localExcelDatabase');
            if (stored) {
                const data = JSON.parse(stored);
                this.users = data.users || [];
                this.sessions = data.sessions || [];
                this.otps = data.otps || [];
                
                console.log(`📖 Database loaded from localStorage: ${this.users.length} users`);
                console.log(`🕐 Last updated: ${data.lastUpdated || 'Unknown'}`);
                console.log(`📂 Expected project path: C:\\Users\\2363413\\cpp_stl_project\\database\\users_database.json`);
                
                // Show user list for verification
                if (this.users.length > 0) {
                    console.log(`👥 Users in database:`);
                    this.users.forEach(user => {
                        console.log(`   - ${user.username} (${user.email}) - Last login: ${user.lastLogin || 'Never'}`);
                    });
                }
                
                // Show instructions for project folder integration
                console.log(`\n💡 TO USE PROJECT FOLDER DATABASE:`);
                console.log(`   1. Use saveToProjectFolder() to download Excel database`);
                console.log(`   2. Move to project database folder and use uploadDatabase()`);
                
                return true;
            }
            
            // If no localStorage data, will create new database with demo user
            console.log('📝 No existing database found, will create new one with demo user');
            console.log('📂 Database will be saved to: C:\\Users\\2363413\\cpp_stl_project\\database\\');
            return false;
            
        } catch (error) {
            console.error('Error loading database:', error);
            return false;
        }
    }

    // Load database from project folder file (JSON format)
    async loadFromProjectFile(fileContent) {
        try {
            const databaseData = JSON.parse(fileContent);
            
            // Validate database structure
            if (!databaseData.users || !Array.isArray(databaseData.users)) {
                throw new Error('Invalid database format: missing users array');
            }
            
            // Load database data
            this.users = databaseData.users || [];
            this.sessions = databaseData.sessions || [];
            this.otps = databaseData.otps || [];
            
            // Update localStorage with loaded data
            const backupData = {
                users: this.users,
                sessions: this.sessions,
                otps: this.otps,
                lastUpdated: databaseData.lastUpdated || new Date().toISOString()
            };
            localStorage.setItem('localExcelDatabase', JSON.stringify(backupData));
            
            console.log(`📁 Database loaded from project: ${this.users.length} users`);
            
            return true;
            
        } catch (error) {
            console.error('Error loading from project file:', error);
            throw error;
        }
    }

    // Save to localStorage as backup
    saveToStorage() {
        const data = {
            users: this.users,
            sessions: this.sessions,
            otps: this.otps,
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem('localExcelDatabase', JSON.stringify(data));
    }

    // Load from localStorage (fallback method)
    loadFromStorage() {
        try {
            // Try new format first
            let stored = localStorage.getItem('localExcelDatabase');
            if (stored) {
                const data = JSON.parse(stored);
                this.users = data.users || [];
                this.sessions = data.sessions || [];
                this.otps = data.otps || [];
                return;
            }
            
            // Fallback to old format
            stored = localStorage.getItem('excelDatabase');
            if (stored) {
                const data = JSON.parse(stored);
                this.users = data.users || [];
                this.sessions = data.sessions || [];
                this.otps = data.otps || [];
                
                // Migrate to new format
                this.saveToLocalDatabase();
            }
        } catch (error) {
            console.error('Error loading from storage:', error);
        }
    }

    // Wait for database to be ready
    async waitForInit() {
        let attempts = 0;
        while (!this.isInitialized && attempts < 50) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        return this.isInitialized;
    }

    // Clean expired OTPs
    cleanup() {
        const now = new Date();
        this.otps = this.otps.filter(otp => new Date(otp.expiresAt) > now);
        this.saveToStorage();
    }

    // Get database stats
    getStats() {
        return {
            totalUsers: this.users.length,
            activeUsers: this.users.filter(user => user.isActive).length,
            verifiedUsers: this.users.filter(user => user.isVerified).length,
            activeOTPs: this.otps.filter(otp => 
                !otp.isUsed && new Date(otp.expiresAt) > new Date()
            ).length,
            totalSessions: this.sessions.length
        };
    }
}

// Initialize global database instance
window.excelDB = new ExcelDatabaseManager();

// Add helper methods to window for easy access
window.viewDatabase = () => window.excelDB.getDatabaseStructure();
window.listOTP = () => window.excelDB.listOTPFiles();
window.viewOTP = (fileName) => {
    const content = window.excelDB.viewOTPFile(fileName);
    if (content) {
        console.log(`\n📄 === OTP FILE: ${fileName} ===`);
        console.log(content);
        console.log(`================================\n`);
    } else {
        console.log(`❌ OTP file not found: ${fileName}`);
    }
    return content;
};
window.dbStats = () => window.excelDB.getStats();

// Add database upload functionality (Excel and JSON support)  
window.uploadDatabase = () => {
    console.log(`📂 Upload database from: C:\\Users\\2363413\\cpp_stl_project\\database\\`);
    console.log(`   Supported files: users_database.xlsx, users_database.json`);
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.json';
    input.style.display = 'none';
    
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        console.log(`📁 Loading database file: ${file.name}`);
        
        try {
            if (file.name.endsWith('.xlsx')) {
                // Handle Excel file
                const arrayBuffer = await file.arrayBuffer();
                const workbook = XLSX.read(arrayBuffer, { type: 'array' });
                
                // Read Users sheet
                const usersSheet = workbook.Sheets['Users'];
                const users = XLSX.utils.sheet_to_json(usersSheet);
                
                // Read Sessions sheet (if exists)
                const sessionsSheet = workbook.Sheets['Sessions'];
                const sessions = sessionsSheet ? XLSX.utils.sheet_to_json(sessionsSheet) : [];
                
                // Read OTP sheet (if exists)  
                const otpSheet = workbook.Sheets['OTP'];
                const otps = otpSheet ? XLSX.utils.sheet_to_json(otpSheet) : [];
                
                // Convert Excel data to internal format
                window.excelDB.users = users.map(user => ({
                    id: user.ID,
                    username: user.Username,
                    email: user.Email,
                    passwordHash: user.PasswordHash,
                    fullName: user.FullName,
                    role: user.Role,
                    createdAt: user.CreatedAt,
                    lastLogin: user.LastLogin,
                    isActive: user.IsActive,
                    isVerified: user.IsVerified,
                    favoriteGenres: user.FavoriteGenres ? user.FavoriteGenres.split(',') : [],
                    booksRead: user.BooksRead || 0,
                    bio: user.Bio || '',
                    theme: user.Theme || 'light',
                    notifications: user.Notifications !== false,
                    autoSave: user.AutoSave !== false
                }));
                
                window.excelDB.sessions = sessions.map(session => ({
                    id: session.ID,
                    userId: session.UserID,
                    token: session.Token,
                    createdAt: session.CreatedAt,
                    expiresAt: session.ExpiresAt,
                    isActive: session.IsActive,
                    endedAt: session.EndedAt
                }));
                
                window.excelDB.otps = otps.map(otp => ({
                    id: otp.ID,
                    email: otp.Email,
                    otp: otp.OTP,
                    createdAt: otp.CreatedAt,
                    expiresAt: otp.ExpiresAt,
                    isUsed: otp.IsUsed,
                    purpose: otp.Purpose,
                    isLatest: otp.IsLatest
                }));
                
                // Update localStorage
                await window.excelDB.updateDatabase();
                
                console.log(`✅ Excel database successfully loaded from project folder!`);
                console.log(`📊 Loaded: ${window.excelDB.users.length} users, ${window.excelDB.sessions.length} sessions, ${window.excelDB.otps.length} OTPs`);
                
            } else if (file.name.endsWith('.json')) {
                // Handle JSON file (backward compatibility)
                const fileContent = await file.text();
                await window.excelDB.loadFromProjectFile(fileContent);
                
                console.log(`✅ JSON database successfully loaded from project folder!`);
            } else {
                throw new Error('Unsupported file format. Use .xlsx or .json files.');
            }
            
            console.log(`🔄 You can now login with users from the project database`);
            
        } catch (error) {
            console.error(`❌ Error loading database file:`, error.message);
            console.log(`💡 Make sure the file is a valid database file from the project folder`);
        }
        
        // Clean up
        document.body.removeChild(input);
    };
    
    document.body.appendChild(input);
    input.click();
};

// Download Excel database (automatically created)
window.saveToProjectFolder = async () => {
    try {
        // Get Excel database from memory
        const base64Excel = localStorage.getItem('projectExcelDatabase');
        const dbInfo = JSON.parse(localStorage.getItem('projectExcelDatabaseInfo') || '{}');
        
        if (!base64Excel) {
            console.log(`❌ No Excel database found. Register some users first.`);
            return;
        }

        // Convert base64 back to binary
        const binaryString = atob(base64Excel);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        // Create downloadable Excel file
        const blob = new Blob([bytes], { 
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        });
        const url = URL.createObjectURL(blob);
        
        // Download Excel database
        const link = document.createElement('a');
        link.href = url;
        link.download = dbInfo.filename || 'users_database.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        console.log(`📊 Excel database downloaded: ${dbInfo.filename || 'users_database.xlsx'}`);
        console.log(`📁 MOVE TO: C:\\Users\\2363413\\cpp_stl_project\\database\\${dbInfo.filename || 'users_database.xlsx'}`);
        console.log(`📈 Contains: ${dbInfo.users || 0} users, ${dbInfo.sessions || 0} sessions, ${dbInfo.otps || 0} OTPs`);
        console.log(`🕐 Last updated: ${dbInfo.lastUpdated || 'Unknown'}`);
        
    } catch (error) {
        console.error(`❌ Error downloading Excel database:`, error);
    }
};

// Cleanup expired OTPs every minute
setInterval(() => {
    if (window.excelDB) {
        window.excelDB.cleanup();
    }
}, 60000);

// Global console commands for easy database management
window.deleteAllRegisteredUsers = async function() {
    if (!window.excelDB) {
        console.log('❌ Database not initialized');
        return;
    }
    
    const result = await window.excelDB.deleteAllRegisteredUsers();
    if (result.success) {
        console.log(`✅ Deleted ${result.deletedCount} registered users`);
        console.log(`📊 Remaining: ${result.remainingCount} demo accounts`);
        if (result.deletedUsers.length > 0) {
            console.log('Deleted users:', result.deletedUsers);
        }
        return result;
    } else {
        console.log(`❌ Error: ${result.error}`);
        return result;
    }
};

window.getUserStats = function() {
    if (!window.excelDB) {
        console.log('❌ Database not initialized');
        return;
    }
    
    const stats = window.excelDB.getUserStats();
    console.log('📊 Database Statistics:', stats);
    return stats;
};

window.listAllUsers = function() {
    if (!window.excelDB) {
        console.log('❌ Database not initialized');
        return;
    }
    
    console.log('👥 All Users:');
    window.excelDB.users.forEach((user, index) => {
        const isDemo = user.id.startsWith('demo-');
        const status = isDemo ? '[DEMO]' : '[REGISTERED]';
        console.log(`${index + 1}. ${user.username} (${user.email}) - ${user.role} ${status}`);
    });
    
    return window.excelDB.users;
};

// Show helpful console messages
console.log(`\n📚 Book Summary Manager - Database Ready`);
console.log(`👤 Demo accounts available:`);
console.log(`   🔑 Admin: "Admin/Admin" (Full access)`);
console.log(`   👤 User: "User/User" (Limited access)`);
console.log(`💡 Commands: viewDatabase(), uploadDatabase(), saveToProjectFolder()`);
console.log(`🗑️ User Management: deleteAllRegisteredUsers(), getUserStats(), listAllUsers()`);
console.log(`=======================================\n`); 