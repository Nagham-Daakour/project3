const usersDB = JSON.parse(localStorage.getItem('eclipseUsers')) || [];

function saveUsersToLocalStorage() {
    localStorage.setItem('eclipseUsers', JSON.stringify(usersDB));
}

function registerUser(userData) {
    const existingUser = usersDB.find(user => user.email === userData.email);
    
    if (existingUser) {
        return { success: false, message: 'البريد الإلكتروني مسجل بالفعل!' };
    }
    
    if (userData.password !== userData.confirmPassword) {
        return { success: false, message: 'كلمتا المرور غير متطابقتين!' };
    }
    
    if (userData.password.length < 8) {
        return { success: false, message: 'كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل!' };
    }
    
    usersDB.push({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password, 
        createdAt: new Date().toISOString()
    });
    
    saveUsersToLocalStorage();
    return { success: true, message: 'تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.' };
}

function loginUser(email, password, rememberMe) {
    const user = usersDB.find(user => user.email === email);
    
    if (!user) {
        return { success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة!' };
    }
    
    if (user.password !== password) {
        return { success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة!' };
    }
    
    if (rememberMe) {
        localStorage.setItem('eclipseRememberedUser', JSON.stringify({
            email: user.email,
            firstName: user.firstName
        }));
    } else {
        localStorage.removeItem('eclipseRememberedUser');
    }
    
    sessionStorage.setItem('eclipseCurrentUser', JSON.stringify({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
    }));
    
    return { 
        success: true, 
        message: 'تم تسجيل الدخول بنجاح!',
        user: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        }
    };
}

function togglePasswordVisibility(inputId, buttonId) {
    const passwordInput = document.getElementById(inputId);
    const toggleButton = document.getElementById(buttonId);
    
    if (passwordInput && toggleButton) {
        toggleButton.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            const icon = this.querySelector('i');
            icon.className = type === 'password' ? 'bi bi-eye' : 'bi bi-eye-slash';
        });
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showAlert(alertId, message, type = 'danger') {
    const alertElement = document.getElementById(alertId);
    
    if (alertElement) {
        alertElement.textContent = message;
        alertElement.className = `alert alert-${type} mt-4`;
        alertElement.classList.remove('d-none');
        
        setTimeout(() => {
            alertElement.classList.add('d-none');
        }, 5000);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    
    if (document.getElementById('registerForm')) {
        const registerForm = document.getElementById('registerForm');
        
        togglePasswordVisibility('regPassword', 'toggleRegPassword');
        togglePasswordVisibility('confirmPassword', 'toggleConfirmPassword');
        
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const userData = {
                firstName: document.getElementById('firstName').value.trim(),
                lastName: document.getElementById('lastName').value.trim(),
                email: document.getElementById('regEmail').value.trim(),
                password: document.getElementById('regPassword').value,
                confirmPassword: document.getElementById('confirmPassword').value
            };
            
            if (!userData.firstName || !userData.lastName || !userData.email || !userData.password) {
                showAlert('registerAlert', 'يرجى ملء جميع الحقول المطلوبة!', 'danger');
                return;
            }
            
            if (!isValidEmail(userData.email)) {
                showAlert('registerAlert', 'يرجى إدخال بريد إلكتروني صحيح!', 'danger');
                return;
            }
            
            const result = registerUser(userData);
            
            if (result.success) {
                showAlert('registerAlert', result.message, 'success');
                registerForm.reset();
                
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                showAlert('registerAlert', result.message, 'danger');
            }
        });
    }
    
    if (document.getElementById('loginForm')) {
        const loginForm = document.getElementById('loginForm');
        
        togglePasswordVisibility('password', 'togglePassword');
        
        const rememberedUser = JSON.parse(localStorage.getItem('eclipseRememberedUser'));
        if (rememberedUser) {
            document.getElementById('email').value = rememberedUser.email;
            document.getElementById('rememberMe').checked = true;
        }
        
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('rememberMe').checked;
            
            if (!email || !password) {
                showAlert('loginAlert', 'يرجى ملء جميع الحقول المطلوبة!', 'danger');
                return;
            }
            
            if (!isValidEmail(email)) {
                showAlert('loginAlert', 'يرجى إدخال بريد إلكتروني صحيح!', 'danger');
                return;
            }
            
            const result = loginUser(email, password, rememberMe);
            
            if (result.success) {
                showAlert('loginAlert', result.message, 'success');
                
                setTimeout(() => {
                    alert(`مرحباً ${result.user.firstName} ${result.user.lastName}! تم تسجيل دخولك بنجاح.`);
                    loginForm.reset();
                }, 1500);
            } else {
                showAlert('loginAlert', result.message, 'danger');
            }
        });
    }
});