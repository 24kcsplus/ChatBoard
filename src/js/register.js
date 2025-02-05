document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form.needs-validation');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const passwordConfirmInput = document.getElementById('password-confirm');

    // 实时密码一致性检查
    function checkPasswordMatch() {
        if (passwordInput.value && passwordConfirmInput.value) {
            if (passwordInput.value !== passwordConfirmInput.value) {
                passwordConfirmInput.classList.add('is-invalid');
                passwordConfirmInput.nextElementSibling.textContent = '两次输入的密码不一致';
            } else {
                passwordConfirmInput.classList.remove('is-invalid');
            }
        }
    }

    // 密码复杂度验证
    function isPasswordValid(password) {
        // 包含数字、大小写字母、特殊符号，长度8-22
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,22}$/;
        return regex.test(password);
    }

    // 实时密码复杂度检查
    function checkPasswordComplexity() {
        const password = passwordInput.value;
        if (password) {
            if (!isPasswordValid(password)) {
                passwordInput.classList.add('is-invalid');
                passwordInput.nextElementSibling.textContent = '密码需包含数字、大小写字母和特殊符号(@$!%*?&)，长度8-22';
            } else {
                passwordInput.classList.remove('is-invalid');
            }
        }
    }

    // 实时邮箱格式检查
    function checkEmailFormat() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailInput.value && !emailRegex.test(emailInput.value)) {
            emailInput.classList.add('is-invalid');
            emailInput.nextElementSibling.textContent = '电子邮箱无效';
        } else {
            emailInput.classList.remove('is-invalid');
        }
    }

    // 输入事件监听
    let debounceTimer;
    passwordInput.addEventListener('input', checkPasswordMatch);
    passwordConfirmInput.addEventListener('input', checkPasswordMatch);
    emailInput.addEventListener('input', checkEmailFormat);
    passwordInput.addEventListener('input', function () {
        checkPasswordComplexity();
        checkPasswordMatch();
    });

    // 表单提交验证
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        event.stopPropagation();

        let isValid = true;

        // 验证用户名
        if (!nameInput.value.trim()) {
            nameInput.classList.add('is-invalid');
            emailInput.nextElementSibling.textContent = '用户名不能为空';
            isValid = false;
        }

        // 验证邮箱
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value.trim()) {
            emailInput.nextElementSibling.textContent = '电子邮箱不能为空';
            emailInput.classList.add('is-invalid');
            isValid = false;
        } else if (!emailRegex.test(emailInput.value)) {
            emailInput.nextElementSibling.textContent = '电子邮箱无效';
            emailInput.classList.add('is-invalid');
            isValid = false;
        }

        // 验证密码
        if (!passwordInput.value.trim()) {
            passwordInput.nextElementSibling.textContent = '密码不能为空';
            passwordInput.classList.add('is-invalid');
            isValid = false;
        } else if (!isPasswordValid(passwordInput.value)) {
            passwordInput.nextElementSibling.textContent = '密码需包含数字、大小写字母和特殊符号(@$!%*?&)，长度8-22';
            passwordInput.classList.add('is-invalid');
            isValid = false;
        }

        if (!passwordInput.value.trim()) {
            passwordInput.classList.add('is-invalid');
            isValid = false;
        }

        // 验证确认密码
        if (!passwordConfirmInput.value.trim()) {
            passwordConfirmInput.nextElementSibling.textContent = '确认密码不能为空';
            passwordConfirmInput.classList.add('is-invalid');
            isValid = false;
        } else if (passwordInput.value !== passwordConfirmInput.value) {
            passwordConfirmInput.nextElementSibling.textContent = '两次输入的密码不一致';
            passwordConfirmInput.classList.add('is-invalid');
            isValid = false;
        }

        // 提交表单
        if (isValid) {
            form.classList.add('was-validated');
            console.log('表单验证通过，执行提交操作');

            registerSubmit(nameInput.value, emailInput.value, passwordInput.value, passwordConfirmInput.value);
        }
    });


    function registerSubmit(username, email, password, confirm_password) {
        // todo：RSA 加密，如果有时间就加上
        // const cryptoModule = 'https://cdn.bootcdn.net/ajax/libs/crypto-js/4.2.0/aes.min.js';
        // const crypto = import(cryptoModule);

        // 预处理表单信息
        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('confirm_password', confirm_password);

        // 发送网络请求
        fetch(`register.php`, {
            method: "POST", body: formData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`网络响应错误: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // 根据后端返回结果，更新页面提示信息
                if (data.username_is_empty){
                    nameInput.classList.add('is-invalid');
                    nameInput.nextElementSibling.textContent = '用户名不能为空';
                } else if(data.username_exists){
                    nameInput.classList.add('is-invalid');
                    emailInput.nextElementSibling.textContent = '用户名已占用';
                }

                if (data.email_is_empty){
                    emailInput.classList.add('is-invalid');
                    nameInput.nextElementSibling.textContent = '邮箱不能为空';
                } else if (data.email_exists) {
                    emailInput.classList.add('is-invalid');
                    emailInput.nextElementSibling.textContent = '该邮箱已被使用';
                }

                if (data.password_is_empty){
                    passwordInput.classList.add('is-invalid');
                    passwordInput.nextElementSibling.textContent = '密码不能为空';
                } else if (data.password_is_not_complex){
                    passwordInput.classList.add('is-invalid');
                    passwordInput.nextElementSibling.textContent = '密码需包含数字、大小写字母和特殊符号(@$!%*?&)，长度8-22';
                }

                if (data.password_is_not_confirmed){
                    passwordConfirmInput.classList.add('is-invalid');
                    passwordInput.nextElementSibling.textContent = '两次输入的密码不一致';
                }


            })
            .catch(error => {
                console.error('请求失败:', error);
            });
    }
});

