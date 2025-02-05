document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form.needs-validation');
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

    // 新增密码复杂度验证函数
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

    passwordInput.addEventListener('input', checkPasswordMatch);
    passwordConfirmInput.addEventListener('input', checkPasswordMatch);
    passwordInput.addEventListener('input', function() {
        checkPasswordComplexity();
        checkPasswordMatch(); // 保持原有的一致性检查
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        event.stopPropagation();

        let isValid = true;

        if (!passwordInput.value.trim()) {
            passwordInput.nextElementSibling.textContent = '密码不能为空';
            passwordInput.classList.add('is-invalid');
            isValid = false;
        } else if (!isPasswordValid(passwordInput.value)) {
            passwordInput.nextElementSibling.textContent = '密码需包含数字、大小写字母和特殊符号(@$!%*?&)，长度8-22';
            passwordInput.classList.add('is-invalid');
            isValid = false;
        }

        // 验证密码
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
            // 这里可以添加实际提交代码
            console.log('表单验证通过，执行提交操作');
            // form.submit();
        }
    });
});

