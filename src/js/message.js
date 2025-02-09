document.addEventListener('DOMContentLoaded', () => {
    // 全局状态管理
    let currentReplyForm = null;
    let currentActiveButton = null; // 记录当前激活的按钮

    // 检查登录状态的函数
    function checkLoginStatus() {
        fetch('/api/auth/login_status', {
            credentials: 'include' // 包含cookie
        })
            .then(response => response.json())
            .then(data => {
                if (data.loggedIn) {
                    updateNavbar(data.username);
                }
            })
            .catch(error => console.error('Error:', error));
    }

// 更新导航栏的函数
    function updateNavbar(username) {
        const navRight = document.getElementById('navRight');

        // 创建新的导航项
        navRight.innerHTML = `
        <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" 
               data-bs-toggle="dropdown" aria-expanded="false">
                ${username}
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
                <li><a class="dropdown-item" href="/profile.php">个人中心</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><button class="dropdown-item" id="logoutButton">注销</button></li>
            </ul>
        </li>
    `;

        // 添加注销事件监听
        document.getElementById('logoutButton').addEventListener('click', logout);
    }

    // 注销函数
    function logout() {
        fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
        })
            .then(response => {
                if (response.ok) {
                    // 刷新页面重置导航栏
                    window.location.href = '/';
                }
            })
            .catch(error => console.error('Error:', error));
    }

// 页面加载时检查登录状态
    document.addEventListener('DOMContentLoaded', checkLoginStatus);

    // 回复按钮点击处理
    document.body.addEventListener('click', (e) => {
        if (e.target.closest('.reply-btn')) {
            const btn = e.target.closest('.reply-btn');
            handleReplyClick(btn);
        }
    });

    // 点赞按钮处理
    document.body.addEventListener('click', (e) => {
        if (e.target.closest('.like-btn')) {
            const btn = e.target.closest('.like-btn');
            handleLikeClick(btn);
        }
    });

    function handleReplyClick(btn) {
        // 点击相同按钮时关闭表单
        if (currentActiveButton === btn) {
            currentReplyForm.remove();
            currentReplyForm = null;
            btn.classList.remove('active-reply-button');
            currentActiveButton = null;
            return;
        }

        // 清理旧状态
        if (currentActiveButton) {
            currentActiveButton.classList.remove('active-reply-button');
            currentReplyForm.remove();
        }

        // 插入新表单
        const parent = btn.closest('.flex-grow-1');
        const template = document.getElementById('replyTemplate');
        const clone = template.content.cloneNode(true);
        currentReplyForm = clone.children[0];
        const submitBtn = currentReplyForm.querySelector('button[type="submit"]');

        // 设置高亮状态
        btn.classList.add('active-reply-button');
        submitBtn.classList.add('active-submit');
        currentActiveButton = btn;

        // 插入@提及
        const username = btn.dataset.user;
        const textarea = currentReplyForm.querySelector('textarea');
        textarea.value = `@${username} `;
        parent.appendChild(currentReplyForm);
        textarea.focus();

        // 监听表单的焦点变化
        const formElements = currentReplyForm.querySelectorAll('textarea, button');
        formElements.forEach(element => {
            // 表单元素获得焦点时保持按钮高亮
            element.addEventListener('focus', () => {
                btn.classList.add('active-reply-button');
                submitBtn.classList.add('active-submit');
            });

            element.addEventListener('blur', () => {
                submitBtn.classList.remove('active-submit');
            });
        });

        // 表单提交处理
        currentReplyForm.querySelector('form').addEventListener('submit', async (e) => {
            e.preventDefault();
            submitBtn.disabled = true
            submitBtn.classList.remove('active-submit');

            try {
                await handleFormSubmit(e.target, username);
            } finally {
                // 提交完成后清理状态
                if (currentReplyForm) {
                    currentReplyForm.remove();
                    currentReplyForm = null;
                }
                btn.classList.remove('active-reply-button');
                currentActiveButton = null;
                submitBtn.disabled = false;
            }
        });
    }

    // 处理点赞点击
    function handleLikeClick(btn) {
        const isLiked = btn.classList.contains('liked');
        const countSpan = btn.querySelector('.count');
        let count = parseInt(countSpan.textContent) || 0;

        // 切换状态
        btn.classList.toggle('liked');

        // 更新计数
        count = isLiked ? Math.max(0, count - 1) : count + 1;
        countSpan.textContent = count;

        // 触发动画
        btn.classList.toggle('active')
    }


    // 处理表单提交
    async function handleFormSubmit(form, repliedUser) {
        const textarea = form.querySelector('textarea');
        const content = textarea.value.trim();

        if (!content) return;

        try {
            const response = await fetch('index.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: content,
                    parent_id: currentActiveButton?.dataset.parentId || 0,
                    reply_to_user: currentActiveButton?.dataset.userId || null
                })
            });

            const result = await response.json();
            if (result.success) {
                await loadMessages(); // 重新加载留言
            }
        } catch (error) {
            console.error('提交失败:', error);
        }
    }


    // 留言加载部分
    loadMessages();

    async function loadMessages() {
        const container = document.getElementById('commentList'); // 获取容器引用

        try {
            const response = await fetch('index.php', {
                method: 'POST'
            });
            const { data } = await response.json();
            renderMessages(data);
        } catch (error) {
            console.error('加载留言失败:', error);

            // 清空容器并显示错误提示
            container.innerHTML = '';
            const errorState = document.createElement('div');
            errorState.className = 'text-center py-5 text-danger';
            errorState.innerHTML = `
            <i class="bi bi-wifi-off fs-2"></i>
            <p class="mt-2 mb-0">网络连接失败，请检查网络后重试</p>
            <p class="mt-2 mb-0">错误信息：${error}</p>
        `;
            container.appendChild(errorState);
        }
    }

    function renderMessages(messages, container = document.getElementById('commentList'), level = 0) {
        container.innerHTML = '';

        // 添加空状态提示（仅在顶级容器且无留言时显示）
        if (level === 0 && (!messages || messages.length === 0)) {
            const emptyState = document.createElement('div');
            emptyState.className = 'text-center py-5 text-muted';
            emptyState.innerHTML = `
            <i class="bi bi-chat-square-text fs-2"></i>
            <p class="mt-2 mb-0">暂无留言，快来抢沙发吧~</p>
        `;
            container.appendChild(emptyState);
            return; // 直接返回不再继续执行
        }

        messages.forEach(msg => {
            const messageEl = createMessageElement(msg, level);
            container.appendChild(messageEl);
            if (msg.replies && msg.replies.length) {
                const repliesContainer = document.createElement('div');
                repliesContainer.className = 'replies-container';
                renderMessages(msg.replies, repliesContainer, level + 1);
                messageEl.querySelector('.flex-grow-1').appendChild(repliesContainer);
            }
        });
    }

    function createMessageElement(msg, level) {
        const div = document.createElement('div');
        div.className = `list-group-item py-3 ${level > 0 ? 'reply-item' : ''}`;
        div.innerHTML = `
        <div class="d-flex gap-3">
            <img src="https://via.placeholder.com/40" class="avatar rounded-circle">
            <div class="flex-grow-1">
                <div class="d-flex justify-content-between mb-2">
                    <h6 class="mb-0 fw-bold">
                        ${msg.username}
                        ${msg.reply_to_username ?
            `<span class="text-muted fw-normal">回复
                                <span class="mention">@${msg.reply_to_username}</span>
                            </span>` : ''}
                        ${msg.edited_at ?
            `<small class="text-muted ms-2">（已编辑）</small>` : ''}
                    </h6>
                    <small class="text-muted">${formatTime(msg.created_at)}</small>
                </div>
                <p class="mb-2 message-content">${msg.content}</p>
                <div class="message-actions d-flex gap-2">
                    <button class="btn btn-sm btn-outline-secondary like-btn ${msg.liked ? 'liked' : ''}" 
                            data-message-id="${msg.id}">
                        <span class="icon-wrapper">
                            <i class="bi bi-hand-thumbs-up"></i>
                            <i class="bi bi-hand-thumbs-up-fill"></i>
                        </span>
                        <span class="count">${msg.likes}</span>
                    </button>
                    <button class="btn btn-sm btn-outline-secondary reply-btn" 
                            data-user-id="${msg.user_id}"
                            data-user="${msg.username}"
                            data-parent-id="${msg.id}">
                        回复
                    </button>
                </div>
            </div>
        </div>
    `;
        return div;
    }

});