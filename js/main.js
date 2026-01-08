/**
 * 茶文化网站 - 主要交互脚本
 */

document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initNavbar();
    initMobileMenu();
    initScrollAnimations();
    initSmoothScroll();
    initFormValidation();
    initLazyLoad(); // 新增：启用图片懒加载（优化项，不影响显示）
});

/**
 * 导航栏滚动效果
 */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    
    if (!navbar) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // 初始检查
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    }
}

/**
 * 移动端菜单切换
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!menuToggle || !navLinks) return;
    
    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        
        // 切换汉堡菜单动画
        const spans = menuToggle.querySelectorAll('span');
        spans.forEach((span, index) => {
            span.classList.toggle('active');
        });
    });
    
    // 点击导航链接后关闭菜单
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
        });
    });
    
    // 点击页面其他地方关闭菜单
    document.addEventListener('click', function(e) {
        if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
        }
    });
}

/**
 * 滚动动画效果
 */
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    if (fadeElements.length === 0) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    fadeElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * 平滑滚动
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * 表单验证
 */
function initFormValidation() {
    const form = document.querySelector('.contact-form form');
    
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = form.querySelector('input[name="name"]');
        const email = form.querySelector('input[name="email"]');
        const message = form.querySelector('textarea[name="message"]');
        
        let isValid = true;
        
        // 验证姓名
        if (name && name.value.trim() === '') {
            showError(name, '请输入您的姓名');
            isValid = false;
        } else if (name) {
            removeError(name);
        }
        
        // 验证邮箱
        if (email && !isValidEmail(email.value)) {
            showError(email, '请输入有效的邮箱地址');
            isValid = false;
        } else if (email) {
            removeError(email);
        }
        
        // 验证留言
        if (message && message.value.trim() === '') {
            showError(message, '请输入您的留言');
            isValid = false;
        } else if (message) {
            removeError(message);
        }
        
        if (isValid) {
            // 模拟表单提交成功
            showSuccessMessage();
            form.reset();
        }
    });
}

/**
 * 验证邮箱格式
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * 显示错误信息
 */
function showError(input, message) {
    const formGroup = input.closest('.form-group');
    
    // 移除已有的错误信息
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // 添加错误样式
    input.style.borderColor = '#e74c3c';
    
    // 创建错误信息元素
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '0.85rem';
    errorDiv.style.marginTop = '5px';
    errorDiv.textContent = message;
    
    formGroup.appendChild(errorDiv);
}

/**
 * 移除错误信息
 */
function removeError(input) {
    const formGroup = input.closest('.form-group');
    const existingError = formGroup.querySelector('.error-message');
    
    if (existingError) {
        existingError.remove();
    }
    
    input.style.borderColor = '';
}

/**
 * 显示成功信息
 */
function showSuccessMessage() {
    const form = document.querySelector('.contact-form');
    
    // 创建成功提示
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #8BC34A, #689F38);
        color: white;
        padding: 30px 50px;
        border-radius: 16px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        z-index: 9999;
        text-align: center;
        animation: fadeInScale 0.3s ease;
    `;
    successDiv.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 15px;">✓</div>
        <div style="font-size: 1.2rem; font-weight: 600;">提交成功！</div>
        <div style="font-size: 0.9rem; margin-top: 10px; opacity: 0.9;">感谢您的留言，我们会尽快回复您。</div>
    `;
    
    document.body.appendChild(successDiv);
    
    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInScale {
            from {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.8);
            }
            to {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
        }
    `;
    document.head.appendChild(style);
    
    // 3秒后自动消失
    setTimeout(() => {
        successDiv.style.animation = 'fadeInScale 0.3s ease reverse';
        setTimeout(() => {
            successDiv.remove();
        }, 300);
    }, 3000);
}

/**
 * 图片懒加载
 */
function initLazyLoad() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if (lazyImages.length === 0) return;
    
    const imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });
}

/**
 * 页面加载完成后的额外初始化
 */
window.addEventListener('load', function() {
    // 移除加载动画（如果有的话）
    const loader = document.querySelector('.page-loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.remove();
        }, 300);
    }
    
    // 初始化懒加载
    initLazyLoad();
});