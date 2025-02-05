document.addEventListener('DOMContentLoaded', function () {
	const emailInput = document.getElementById('email');
	const passwordInput = document.getElementById('password');

	form.addEventListener('submit', function (event) {
		event.preventDefault();
		event.stopPropagation();

		fetch(`login.php`, {
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
				if (data.success) {

				}


			})
			.catch(error => {
				console.error('请求失败:', error);
			});
	});
});