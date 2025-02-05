document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form.needs-validation');
    const emailInput = document.getElementById('email');

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

    emailInput.addEventListener('input', checkEmailFormat);

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        event.stopPropagation();

        let isValid = true;

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

        // 提交表单
        if (isValid) {
            form.classList.add('was-validated');
            // 这里可以添加实际提交代码
            console.log('表单验证通过，执行提交操作');
            // form.submit();
        }
    });
});