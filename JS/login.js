const check_xss = (input) => {
    const DOMPurify = window.DOMPurify;
    const sanitizedInput = DOMPurify.sanitize(input);
    if (sanitizedInput !== input) {
        alert('XSS 공격 가능성이 있는 입력값을 발견했습니다.');
        return false;
    }
    return sanitizedInput;
};

const check_input = () => {
    const loginForm = document.getElementById('login_form');
    const loginBtn = document.getElementById('login_btn');
    const emailInput = document.getElementById('typeEmailX');
    const passwordInput = document.getElementById('typePasswordX');
    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value.trim();
    const sanitizedEmail = check_xss(emailValue);
    const sanitizedPassword = check_xss(passwordValue); 

    if (emailValue === '') {
        alert('이메일을 입력하세요.');
        return false;
    }

    if (passwordValue === '') {
        alert('비밀번호를 입력하세요.');
        return false;
    }

    if (emailValue.length < 5){
        alert('아이디는 최소 5글자 이상 입력해야합니다.');
        return false;
    }

    if (passwordValue.length < 8){
        alert('비밀번호는 최소 8글자 이상 입력해야합니다.');
        return false;
    }

    const hasSpecialChar = passwordValue.match(/[!,@#$%^&*()_+/-[\]{};':"\\|,.<>\/?]+/) !== null;
    if (!hasSpecialChar){
        alert('패스워드는 특수문자를 1개 이상 포함해야 합니다.');
        return false;
    }
    const hasUppercase = passwordValue.match(/[A-Z]+/) !== null;
    const hasLowercase = passwordValue.match(/[a-z]+/) !== null;
    if (!hasLowercase || !hasUppercase){
        alert('패스워드는 대소문자를 1개 이상 포함해야 합니다.');
        return false;
    }
    
    if (!sanitizedEmail) {
        return false;
    }
    if (!sanitizedPassword){
        return false;
    }
    console.log('이메일:', emailValue);
    console.log('비밀번호:', passwordValue);
    loginForm.submit();
};

document.getElementById("login_btn").addEventListener('click', check_input);