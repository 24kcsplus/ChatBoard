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
    function handleFormSubmit(form, repliedUser) {
        const textarea = form.querySelector('textarea');
        const content = textarea.value.trim();

        if (content) {
            console.log('提交回复：', {
                content: content,
                replyTo: repliedUser
            });

            // 清空表单
            form.remove();
            currentReplyForm = null;
        }
    }
});