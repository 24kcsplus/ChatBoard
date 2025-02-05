document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form.needs-validation');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        event.stopPropagation();

        const formData = new FormData();
        formData.append('email', emailInput.value);
        formData.append('password', passwordInput.value);

        fetch(`login.php`, {
            method: "POST", body: formData, credentials: 'include'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`网络响应错误: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // 根据后端返回结果，更新页面提示信息
                if (data.login_success) {
                    window.location.href = 'index.php'; // 跳转首页
                } else {
                    if (data.email_is_empty) {
                        emailInput.classList.add('is-invalid');
                        emailInput.nextElementSibling.textContent = '用户名或电子邮箱不能为空'
                    }
                    if (data.password_is_empty) {
                        passwordInput.classList.add('is-invalid');
                        passwordInput.nextElementSibling.textContent = '密码不能为空'
                    }
                    if (!data.email_is_empty && !data.password_is_empty){
                        passwordInput.classList.add('is-invalid');
                        passwordInput.nextElementSibling.textContent = data.error_message;
                    }
                }
            })
            .catch(error => {
                console.error('请求失败:', error);
            });
    });
});