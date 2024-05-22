const check_xss = (input) => {
    const DOMPurify = window.DOMPurify;
    const sanitizedInput = DOMPurify.sanitize(input);
    if (sanitizedInput !== input) {
        alert('XSS 공격 가능성이 있는 입력값을 발견했습니다.');
        return false;
    }
    return sanitizedInput;
};

function setCookie(name, value, expiredays){
    var date = new Date();
    date.setDate(date.getDate() + expiredays);
    document.cookie = escape(name) + "=" + escape(value) + ";expires=" + date.toUTCString() + "; path=/" + ";SameSite=None; Secure";
}

function getCookie(name){
    var cookie = document.cookie;
    console.log("쿠키를 요청합니다.");
    if (cookie != ""){
        var cookie_array = cookie.split("; ");
        for (var index in cookie_array){
            var cookie_name = cookie_array[index].split("=");

            if (cookie_name[0] == "id"){
                return cookie_name[1];
            }
        }
    }
    return ;
}

const check_input = () => {
    const loginForm = document.getElementById('login_form');
    const loginBtn = document.getElementById('login_btn');
    const emailInput = document.getElementById('typeEmailX');
    const passwordInput = document.getElementById('typePasswordX');
    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value.trim();
    const sanitizedEmail = check_xss(emailValue);
    const sanitizedPassword = check_xss(passwordValue); 
    const idsave_check =document.getElementById('idSaveCheck');

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

    if (emailValue.length === 0 || passwordValue.length === 0){
        alert("아이디와 비밀번호를 모두 입력해주세요.");
    }
    else{
        session_set();
        loginForm.submit();
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
    
    if(idsave_check.checked == true){
        alert("쿠키를 저장합니다.", emailValue);
        setCookie("id", emailValue, 1);
        alert("쿠키 값: " + emailValue);
    }
    else {
        setCookie("id", emailValue.value, 0);
    }
    console.log('이메일:', emailValue);
    console.log('비밀번호:', passwordValue);
    loginForm.submit();
};

function init(){
    const emailInput = document.getElementById('typeEmailX');
    const idsave_check =document.getElementById('idSaveCheck');
    let get_id = getCookie("id");

    if (get_id){
        emailInput.value = get_id;
        idsave_check.checked = true;
    }
    session_check();
}

function session_set(){
    let session_id = document.querySelector("#typeEmailX");
    let session_password = document.querySelector("#typePasswordX");
    if (sessionStorage){
        let en_text = encrypt_text(session_password.value);
        sessionStorage.setItem("Session_Storage_id", session_id.value);
        sessionStorage.setItem("Session_Storage_pass", en_text);
    }
    else{
        alert("로컬 스토리지 지원하지 않음");
    }
}

function session_get(){
    if(sessionStorage){
        return sessionStorage.getItem("Session_Storage_test");
    }
    else{
        alert("세션 스토리지 지원하지 않음");
    }
}

function session_check(){
    if (sessionStorage.getItem("Session_Storage_test")){
        alert("이미 로그인 상태입니다.");
        location.href='../login/index_login.html';
    }
}

function session_del(){
    if(sessionStorage){
        sessionStorage.removeItem("Session_Storage_test");
        alert("세션 스토리지 삭제");
    }
    else{
        alert("세션 스토리지 지원하지 않음");
    }
}

function logout(){
    session_del();
    location.href='../Index.html';
}

function encodeByAES256(key, data){
    const cipher = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(key),{
        iv: CryptoJS.enc.Uft8.parse(""),
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
    });
    return cipher.toString();
}

function decodeByAES256(key, data){
    const cipher = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(key),{
        iv: CryptoJS.enc.Uft8.parse(""),
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
    });
    return cipher.toString(CryptoJS.enc.Utf8);
}

function encrypt_text(password){
    const k = "key";
    const rk = k.padEnd(32, " ");
    const b = password;
    const eb = this.encodeByAES256(rk, b);
    return eb;
    console.log(eb);
}

function decrypt_text(){
    const k = "key";
    const rk = k.padEnd(32, " "); const b = password;
    const eb = session_get();
    const b = this.decodeByAES256(rk,eb);
    console.log(b);
}

function init_logined(){
    if(sessionStorage){
        decrypt_text();
    }
    else{
        alert("세션 스토리지 미지원");
    }
}

document.getElementById("login_btn").addEventListener('click', check_input);
