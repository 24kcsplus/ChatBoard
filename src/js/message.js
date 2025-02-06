document.addEventListener('DOMContentLoaded', () => {
    // 全局状态管理
    let currentReplyForm = null;
    let currentActiveButton = null; // 记录当前激活的按钮

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
            const response = await fetch('api/add_message.php', {
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
        try {
            const response = await fetch('api/get_messages.php');
            const { data } = await response.json();
            renderMessages(data);
        } catch (error) {
            console.error('加载留言失败:', error);
        }
    }

    function renderMessages(messages, container = document.getElementById('commentList'), level = 0) {
        container.innerHTML = '';
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