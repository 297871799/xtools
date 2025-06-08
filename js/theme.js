/**
 * 主题管理模块
 * 处理多主题切换功能
 */
(function() {
    // 可用主题列表
    const themes = [
        { id: 'default', name: '深蓝主题', icon: '🌟' },
        { id: 'purple', name: '深紫主题', icon: '💜' },
        { id: 'teal', name: '深青主题', icon: '💎' },
        { id: 'red', name: '深红主题', icon: '❤️' },
        { id: 'green', name: '深绿主题', icon: '💚' },
        { id: 'light', name: '浅色主题', icon: '☀️' }
    ];
    
    // 获取当前主题
    const currentTheme = localStorage.getItem('theme') || 'default';
    
    // DOM元素
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    // 检查是否为深色主题
    function isDarkTheme(theme) {
        return ['default', 'purple', 'teal', 'red', 'green'].includes(theme);
    }
    
    // 初始化主题功能
    function init() {
        // 应用保存的主题设置
        applyTheme(currentTheme);
        
        // 添加主题切换按钮事件监听
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleThemeMenu);
        }
        
        // 创建主题菜单
        createThemeMenu();
    }
    
    // 应用主题
    function applyTheme(themeId) {
        // 保存主题设置到本地存储
        localStorage.setItem('theme', themeId);
        
        // 移除当前主题属性
        document.documentElement.removeAttribute('data-theme');
        
        // 如果不是默认主题，添加主题属性
        if (themeId !== 'default') {
            document.documentElement.setAttribute('data-theme', themeId);
        }
        
        // 更新主题图标
        updateThemeIcon(themeId);
        
        // 更新深色模式
        if (isDarkTheme(themeId)) {
            document.documentElement.classList.add('dark');
            
            // 确保主题菜单中的文字在深色模式下可见
            setTimeout(() => {
                const themeMenu = document.getElementById('themeMenu');
                if (themeMenu) {
                    themeMenu.querySelectorAll('[data-theme] span').forEach(span => {
                        span.style.color = 'rgba(255, 255, 255, 0.95)';
                    });
                    
                    const menuTitle = themeMenu.querySelector('h3');
                    if (menuTitle) {
                        menuTitle.style.color = 'rgba(255, 255, 255, 0.95)';
                    }
                }
            }, 50);
        } else {
            document.documentElement.classList.remove('dark');
        }
    }
    
    // 更新主题图标
    function updateThemeIcon(themeId) {
        if (!themeToggle) return;
        
        const theme = themes.find(t => t.id === themeId) || themes[0];
        
        // 更新主题切换按钮图标
        const iconContainer = themeToggle.querySelector('i') || themeToggle.querySelector('span');
        
        if (iconContainer) {
            // 如果是浅色主题，使用月亮图标，否则使用太阳图标
            if (themeId === 'light') {
                iconContainer.className = 'fas fa-sun text-yellow-500';
                document.querySelectorAll('.fa-moon').forEach(icon => {
                    icon.classList.add('hidden');
                });
                document.querySelectorAll('.fa-sun').forEach(icon => {
                    icon.classList.remove('hidden');
                });
            } else {
                document.querySelectorAll('.fa-moon').forEach(icon => {
                    icon.classList.add('hidden');
                });
                document.querySelectorAll('.fa-sun').forEach(icon => {
                    icon.classList.remove('hidden');
                });
            }
        }
    }
    
    // 切换主题菜单
    function toggleThemeMenu() {
        let themeMenu = document.getElementById('themeMenu');
        
        // 如果主题菜单不存在，创建它
        if (!themeMenu) {
            createThemeMenu();
            themeMenu = document.getElementById('themeMenu');
        }
        
        // 切换菜单显示状态
        if (themeMenu) {
            themeMenu.classList.toggle('hidden');
            
            // 点击其他地方关闭菜单
            if (!themeMenu.classList.contains('hidden')) {
                setTimeout(() => {
                    window.addEventListener('click', closeThemeMenu);
                }, 10);
            } else {
                window.removeEventListener('click', closeThemeMenu);
            }
        }
    }
    
    // 关闭主题菜单
    function closeThemeMenu(e) {
        const themeMenu = document.getElementById('themeMenu');
        const themeToggle = document.getElementById('themeToggle');
        
        if (themeMenu && !themeMenu.contains(e.target) && e.target !== themeToggle && !themeToggle.contains(e.target)) {
            themeMenu.classList.add('hidden');
            window.removeEventListener('click', closeThemeMenu);
        }
    }
    
    // 创建主题菜单
    function createThemeMenu() {
        if (!themeToggle) return;
        
        // 删除现有菜单
        const existingMenu = document.getElementById('themeMenu');
        if (existingMenu) {
            existingMenu.remove();
        }
        
        // 创建主题菜单
        const themeMenu = document.createElement('div');
        themeMenu.id = 'themeMenu';
        themeMenu.className = 'fixed top-20 right-6 md:right-12 bg-white dark:bg-black shadow-xl rounded-xl overflow-hidden z-50 transition-all duration-300 transform hidden';
        themeMenu.style.width = '220px';
        themeMenu.style.backdropFilter = 'blur(10px)';
        themeMenu.style.backgroundColor = 'var(--theme-menu-bg)';
        
        // 主题菜单标题
        const menuTitle = document.createElement('div');
        menuTitle.className = 'py-3 px-4 border-b border-gray-200 dark:border-gray-800';
        menuTitle.innerHTML = '<h3 class="text-gray-900 dark:text-white font-semibold text-center">选择主题</h3>';
        themeMenu.appendChild(menuTitle);
        
        // 深色主题选项
        const darkThemes = document.createElement('div');
        darkThemes.className = 'p-3';
        
        // 深色主题选项列表
        const darkThemeOptions = [
            { id: 'default', label: '深蓝主题', icon: '⭐' },
            { id: 'purple', label: '深紫主题', icon: '💜' },
            { id: 'teal', label: '深青主题', icon: '💎' },
            { id: 'red', label: '深红主题', icon: '❤️' },
            { id: 'green', label: '深绿主题', icon: '💚' },
        ];
        
        darkThemeOptions.forEach(theme => {
            const option = createThemeOption(theme.id, theme.label, theme.icon, true);
            darkThemes.appendChild(option);
        });
        
        themeMenu.appendChild(darkThemes);
        
        // 分隔线
        const divider = document.createElement('div');
        divider.className = 'border-t border-gray-200 dark:border-gray-800 mx-3';
        themeMenu.appendChild(divider);
        
        // 浅色主题选项
        const lightThemes = document.createElement('div');
        lightThemes.className = 'p-3';
        
        // 浅色主题选项
        const lightOption = createThemeOption('light', '浅色主题', '☀️', false);
        lightThemes.appendChild(lightOption);
        
        themeMenu.appendChild(lightThemes);
        
        // 将主题菜单添加到页面
        document.body.appendChild(themeMenu);
        
        // 点击其他区域关闭菜单
        document.addEventListener('click', function(event) {
            if (!themeMenu.contains(event.target) && event.target !== themeToggle) {
                themeMenu.classList.add('hidden');
            }
        });
    }
    
    // 创建主题选项
    function createThemeOption(themeId, label, icon, isDark) {
        const option = document.createElement('div');
        option.className = 'flex items-center gap-3 py-2 px-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors';
        option.setAttribute('data-theme', themeId);
        
        if (currentTheme === themeId) {
            option.classList.add('active', 'bg-gray-100', 'dark:bg-gray-800');
        }
        
        // 修改文字颜色类以确保在深色主题下可见
        option.innerHTML = `
            <span class="text-xl">${icon}</span>
            <span class="text-gray-800 dark:text-white flex-1">${label}</span>
            ${currentTheme === themeId ? '<i class="fas fa-check text-blue-500 dark:text-purple-500"></i>' : ''}
        `;
        
        option.addEventListener('click', function() {
            // 设置新主题
            applyTheme(themeId);
            
            // 更新所有选项的活动状态
            updateActiveThemeOption(themeId);
            
            // 更新主题图标
            updateThemeIcon(themeId);
            
            // 应用附加样式修复
            applyThemeStyleFixes(themeId, isDark);
            
            // 关闭菜单
            document.getElementById('themeMenu').classList.add('hidden');
        });
        
        return option;
    }
    
    // 更新活动主题选项
    function updateActiveThemeOption(activeThemeId) {
        const options = document.querySelectorAll('[data-theme]');
        options.forEach(option => {
            const themeId = option.getAttribute('data-theme');
            const checkIcon = option.querySelector('.fa-check');
            
            if (themeId === activeThemeId) {
                option.classList.add('active', 'bg-gray-100', 'dark:bg-gray-800');
                if (!checkIcon) {
                    option.innerHTML += '<i class="fas fa-check text-blue-500 dark:text-purple-500"></i>';
                }
            } else {
                option.classList.remove('active', 'bg-gray-100', 'dark:bg-gray-800');
                if (checkIcon) {
                    checkIcon.remove();
                }
            }
        });
    }
    
    // 应用主题样式修复
    function applyThemeStyleFixes(themeId, isDark) {
        // 确保文本对比度
        if (isDark) {
            // 强制应用深色主题下的文本对比度
            document.querySelectorAll('.text-gray-600, .text-gray-500, .text-gray-400, .text-gray-300').forEach(el => {
                el.style.color = 'rgba(255, 255, 255, 0.9)';
            });
            
            // 功能卡片特别处理
            document.querySelectorAll('.feature-card').forEach(card => {
                const title = card.querySelector('h3');
                const paragraph = card.querySelector('p');
                const icon = card.querySelector('i');
                
                if (title) title.style.color = '#ffffff';
                if (paragraph) paragraph.style.color = 'rgba(255, 255, 255, 0.9)';
                if (icon) icon.style.color = '#ffffff';
                
                // 增强边框和背景
                card.style.backgroundColor = 'rgba(31, 41, 55, 0.8)';
                card.style.borderColor = 'rgba(255, 255, 255, 0.15)';
            });
            
            // 用户评价卡片
            document.querySelectorAll('.testimonial-card').forEach(card => {
                const userName = card.querySelector('h4');
                const review = card.querySelector('p:not(.text-sm)');
                
                if (userName) userName.style.color = '#ffffff';
                if (review) review.style.color = 'rgba(255, 255, 255, 0.9)';
                
                // 评分星星增强
                card.querySelectorAll('.fa-star, .fa-star-half-alt').forEach(star => {
                    star.style.color = '#ffd700';
                });
            });
            
            // 应用头部特殊处理
            const appHeader = document.querySelector('.app-header');
            if (appHeader) {
                appHeader.querySelectorAll('h1, p').forEach(el => {
                    el.style.textShadow = '0 1px 3px rgba(0, 0, 0, 0.3)';
                });
            }
        }
    }
    
    // 初始化模块
    init();
    
    // 导出主题相关函数（用于其他模块）
    window.themeManager = {
        applyTheme,
        getCurrentTheme: () => currentTheme,
        getThemes: () => [...themes]
    };
})(); 