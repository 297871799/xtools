/**
 * 工具列表页面逻辑
 * 处理工具数据的加载、筛选、排序和展示
 */
(function() {
    // 工具数据缓存
    let toolsData = [];
    let categoriesData = [];
    
    // 当前筛选状态
    let currentFilters = {
        search: '',
        category: 'all',
        sort: 'popular'
    };
    
    // DOM 加载完成后初始化
    document.addEventListener('DOMContentLoaded', init);
    
    // 初始化应用
    async function init() {
        // 绑定移动端菜单切换
        bindMobileMenu();
        
        // 绑定筛选和搜索事件
        bindFilterEvents();
        
        // 加载并渲染工具数据
        await loadAndRenderData();
        
        // 从URL参数应用筛选条件
        applyUrlFilters();
        
        // 深色模式切换绑定
        bindDarkModeToggle();
    }
    
    // 绑定移动端菜单事件
    function bindMobileMenu() {
        const mobileMenuButton = document.getElementById('mobileMenuButton');
        const mobileMenu = document.getElementById('mobileMenu');
        
        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }
    }
    
    // 绑定深色模式切换按钮
    function bindDarkModeToggle() {
        const darkModeToggle = document.getElementById('darkModeToggle');
        
        if (darkModeToggle && window.themeManager) {
            darkModeToggle.addEventListener('click', window.themeManager.toggleDarkMode);
        }
    }
    
    // 绑定筛选和搜索事件
    function bindFilterEvents() {
        const searchInput = document.getElementById('searchInput');
        const categoryFilter = document.getElementById('categoryFilter');
        const sortOption = document.getElementById('sortOption');
        const resetFilters = document.getElementById('resetFilters');
        
        // 搜索输入事件
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                currentFilters.search = searchInput.value.trim().toLowerCase();
                applyFilters();
                updateUrlParams();
            });
        }
        
        // 分类筛选事件
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => {
                currentFilters.category = categoryFilter.value;
                applyFilters();
                updateUrlParams();
            });
        }
        
        // 排序选项事件
        if (sortOption) {
            sortOption.addEventListener('change', () => {
                currentFilters.sort = sortOption.value;
                applyFilters();
                updateUrlParams();
            });
        }
        
        // 重置筛选按钮事件
        if (resetFilters) {
            resetFilters.addEventListener('click', () => {
                // 重置筛选条件
                currentFilters = {
                    search: '',
                    category: 'all',
                    sort: 'popular'
                };
                
                // 重置表单值
                if (searchInput) searchInput.value = '';
                if (categoryFilter) categoryFilter.value = 'all';
                if (sortOption) sortOption.value = 'popular';
                
                // 应用筛选和更新URL
                applyFilters();
                updateUrlParams();
            });
        }
    }
    
    // 从URL参数应用筛选条件
    function applyUrlFilters() {
        const urlParams = new URLSearchParams(window.location.search);
        
        // 获取URL参数
        const category = urlParams.get('category');
        const search = urlParams.get('search');
        const sort = urlParams.get('sort');
        
        // 应用分类筛选
        if (category) {
            currentFilters.category = category;
            const categoryFilter = document.getElementById('categoryFilter');
            if (categoryFilter && categoryFilter.querySelector(`option[value="${category}"]`)) {
                categoryFilter.value = category;
            }
        }
        
        // 应用搜索筛选
        if (search) {
            currentFilters.search = search;
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.value = search;
            }
        }
        
        // 应用排序选项
        if (sort) {
            currentFilters.sort = sort;
            const sortOption = document.getElementById('sortOption');
            if (sortOption && sortOption.querySelector(`option[value="${sort}"]`)) {
                sortOption.value = sort;
            }
        }
        
        // 应用筛选条件
        applyFilters();
    }
    
    // 更新URL参数
    function updateUrlParams() {
        const urlParams = new URLSearchParams();
        
        // 只添加非默认值的参数
        if (currentFilters.category !== 'all') {
            urlParams.set('category', currentFilters.category);
        }
        
        if (currentFilters.search) {
            urlParams.set('search', currentFilters.search);
        }
        
        if (currentFilters.sort !== 'popular') {
            urlParams.set('sort', currentFilters.sort);
        }
        
        // 更新URL，不刷新页面
        const newUrl = urlParams.toString() 
            ? `${window.location.pathname}?${urlParams.toString()}`
            : window.location.pathname;
        
        window.history.replaceState({}, '', newUrl);
    }
    
    // 加载并渲染数据
    async function loadAndRenderData() {
        try {
            // 加载工具和分类数据
            await Promise.all([
                loadToolsData(),
                loadCategoriesData()
            ]);
            
            // 渲染分类筛选选项
            renderCategoryOptions();
            
            // 应用筛选并渲染工具列表
            applyFilters();
            
        } catch (error) {
            console.error('Error loading data:', error);
            showErrorMessage();
        }
    }
    
    // 显示错误消息
    function showErrorMessage() {
        const toolsList = document.getElementById('toolsList');
        if (toolsList) {
            toolsList.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <i class="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
                    <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">加载数据失败</h3>
                    <p class="text-gray-500 dark:text-gray-400 max-w-md mx-auto">抱歉，无法加载工具数据。请稍后再试。</p>
                    <button id="retryLoading" class="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors">
                        <i class="fas fa-redo-alt mr-2"></i> 重试
                    </button>
                </div>
            `;
            
            // 绑定重试按钮
            const retryButton = document.getElementById('retryLoading');
            if (retryButton) {
                retryButton.addEventListener('click', loadAndRenderData);
            }
        }
    }
    
    // 加载工具数据
    async function loadToolsData() {
        try {
            // 如果全局应用已加载工具数据，使用它
            if (window.app && window.app.loadToolsData) {
                toolsData = await window.app.loadToolsData();
                return toolsData;
            }
            
            // 否则使用模拟数据
            toolsData = [
                {
                    id: 'image-converter',
                    name: '图像格式转换器',
                    description: '轻松转换图像格式，支持JPG、PNG、WebP、AVIF等多种格式间的互相转换。',
                    category: 'media',
                    categoryName: '媒体处理',
                    image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                    featured: true,
                    usageCount: 15287,
                    date: '2023-06-15'
                },
                {
                    id: 'code-formatter',
                    name: '代码格式化工具',
                    description: '一键美化各种编程语言代码，提高代码可读性和一致性。',
                    category: 'development',
                    categoryName: '开发工具',
                    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                    featured: true,
                    usageCount: 12459,
                    date: '2023-05-20'
                },
                {
                    id: 'pdf-tools',
                    name: 'PDF工具箱',
                    description: '多功能PDF处理工具，支持PDF合并、拆分、压缩、转换等操作。',
                    category: 'productivity',
                    categoryName: '生产力工具',
                    image: 'https://images.unsplash.com/photo-1568667256549-094345857637?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                    featured: true,
                    usageCount: 18734,
                    date: '2023-04-10'
                },
                {
                    id: 'text-analyzer',
                    name: '文本分析工具',
                    description: '深入分析文本内容，提供字数统计、关键词提取、情感分析等功能。',
                    category: 'utility',
                    categoryName: '实用工具',
                    image: 'https://images.unsplash.com/photo-1518976024611-28bf4b48222e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                    featured: false,
                    usageCount: 9876,
                    date: '2023-07-05'
                },
                {
                    id: 'color-picker',
                    name: '高级取色器',
                    description: '专业的颜色选择和管理工具，支持多种颜色模式和调色板保存。',
                    category: 'design',
                    categoryName: '设计工具',
                    image: 'https://images.unsplash.com/photo-1579547945413-497e1b99dac0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                    featured: true,
                    usageCount: 11345,
                    date: '2023-03-15'
                },
                {
                    id: 'json-formatter',
                    name: 'JSON格式化工具',
                    description: '轻松格式化和验证JSON数据，提高开发效率。',
                    category: 'development',
                    categoryName: '开发工具',
                    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                    featured: false,
                    usageCount: 14256,
                    date: '2023-02-28'
                },
                {
                    id: 'video-compressor',
                    name: '视频压缩工具',
                    description: '高效压缩视频文件，减小体积同时保持高质量。',
                    category: 'media',
                    categoryName: '媒体处理',
                    image: 'https://images.unsplash.com/photo-1626379953822-baec19c3accd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                    featured: true,
                    usageCount: 10234,
                    date: '2023-06-30'
                },
                {
                    id: 'password-generator',
                    name: '密码生成器',
                    description: '创建安全、强大的随机密码，提高账户安全性。',
                    category: 'security',
                    categoryName: '安全工具',
                    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                    featured: false,
                    usageCount: 16789,
                    date: '2023-01-15'
                },
                {
                    id: 'markdown-editor',
                    name: 'Markdown编辑器',
                    description: '功能强大的Markdown编辑器，支持实时预览和导出多种格式。',
                    category: 'productivity',
                    categoryName: '生产力工具',
                    image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                    featured: false,
                    usageCount: 8765,
                    date: '2023-04-22'
                },
                {
                    id: 'image-editor',
                    name: '在线图像编辑器',
                    description: '专业的在线图像编辑工具，提供裁剪、滤镜、调整等多种功能。',
                    category: 'design',
                    categoryName: '设计工具',
                    image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                    featured: true,
                    usageCount: 20123,
                    date: '2023-05-10'
                },
                {
                    id: 'qr-code-generator',
                    name: '二维码生成器',
                    description: '快速生成自定义二维码，支持不同样式和嵌入Logo。',
                    category: 'utility',
                    categoryName: '实用工具',
                    image: 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                    featured: false,
                    usageCount: 7890,
                    date: '2023-07-20'
                },
                {
                    id: 'svg-editor',
                    name: 'SVG编辑器',
                    description: '专业的矢量图形编辑工具，轻松创建和编辑SVG图像。',
                    category: 'design',
                    categoryName: '设计工具',
                    image: 'https://images.unsplash.com/photo-1621839673705-6617adf9e890?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                    featured: false,
                    usageCount: 5678,
                    date: '2023-08-05'
                }
            ];
            
            return toolsData;
        } catch (error) {
            console.error('Error loading tools data:', error);
            return [];
        }
    }
    
    // 加载分类数据
    async function loadCategoriesData() {
        try {
            // 如果全局应用已加载分类数据，使用它
            if (window.app && window.app.loadCategoriesData) {
                categoriesData = await window.app.loadCategoriesData();
                return categoriesData;
            }
            
            // 否则基于工具数据生成分类数据
            const categories = {};
            
            toolsData.forEach(tool => {
                if (!categories[tool.category]) {
                    categories[tool.category] = {
                        id: tool.category,
                        name: tool.categoryName,
                        count: 1,
                        icon: getCategoryIcon(tool.category)
                    };
                } else {
                    categories[tool.category].count++;
                }
            });
            
            categoriesData = Object.values(categories);
            return categoriesData;
        } catch (error) {
            console.error('Error loading categories data:', error);
            return [];
        }
    }
    
    // 获取分类图标
    function getCategoryIcon(category) {
        const icons = {
            'media': 'fas fa-photo-video',
            'development': 'fas fa-code',
            'productivity': 'fas fa-tasks',
            'utility': 'fas fa-tools',
            'design': 'fas fa-palette',
            'security': 'fas fa-shield-alt'
        };
        
        return icons[category] || 'fas fa-cube';
    }
    
    // 渲染分类选项
    function renderCategoryOptions() {
        const categoryFilter = document.getElementById('categoryFilter');
        if (!categoryFilter) return;
        
        // 保留"所有分类"选项
        let html = '<option value="all" data-i18n="toolsPage.allCategories">所有分类</option>';
        
        // 添加分类选项
        categoriesData.forEach(category => {
            html += `<option value="${category.id}">${category.name} (${category.count})</option>`;
        });
        
        categoryFilter.innerHTML = html;
    }
    
    // 应用筛选并渲染工具列表
    function applyFilters() {
        // 应用筛选条件
        let filteredTools = toolsData;
        
        // 按分类筛选
        if (currentFilters.category !== 'all') {
            filteredTools = filteredTools.filter(tool => tool.category === currentFilters.category);
        }
        
        // 按搜索关键词筛选
        if (currentFilters.search) {
            const searchTerm = currentFilters.search.toLowerCase();
            filteredTools = filteredTools.filter(tool => 
                tool.name.toLowerCase().includes(searchTerm) || 
                tool.description.toLowerCase().includes(searchTerm) ||
                tool.categoryName.toLowerCase().includes(searchTerm)
            );
        }
        
        // 应用排序
        filteredTools = sortTools(filteredTools, currentFilters.sort);
        
        // 渲染工具列表
        renderToolsList(filteredTools);
        
        // 更新工具数量显示
        updateToolsCount(filteredTools.length);
        
        // 显示/隐藏无结果提示
        toggleNoResultsMessage(filteredTools.length === 0);
    }
    
    // 排序工具列表
    function sortTools(tools, sortOption) {
        switch(sortOption) {
            case 'name':
                // 按名称字母顺序排序
                return [...tools].sort((a, b) => a.name.localeCompare(b.name));
                
            case 'newest':
                // 按日期排序（最新的在前）
                return [...tools].sort((a, b) => new Date(b.date) - new Date(a.date));
                
            case 'popular':
            default:
                // 按使用次数排序（默认）
                return [...tools].sort((a, b) => b.usageCount - a.usageCount);
        }
    }
    
    // 渲染工具列表
    function renderToolsList(tools) {
        const toolsList = document.getElementById('toolsList');
        
        if (!toolsList) return;
        
        // 清空列表
        toolsList.innerHTML = '';
        
        // 更新工具数量显示
        updateToolsCount(tools.length);
        
        // 显示或隐藏无结果提示
        toggleNoResultsMessage(tools.length === 0);
        
        // 如果没有结果，不继续渲染
        if (tools.length === 0) return;
        
        // 渲染每个工具卡片
        tools.forEach(tool => {
            const card = document.createElement('div');
            card.className = 'tool-card hover:shadow-lg transition-all';
            
            // 获取分类图标
            const categoryIcon = getCategoryIcon(tool.category);
            
            // 卡片内容
            card.innerHTML = `
                <div class="relative overflow-hidden">
                    <img src="${tool.image || 'img/tools/default-tool.jpg'}" alt="${tool.name}" class="tool-card-image">
                    ${tool.featured ? '<span class="absolute top-2 right-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">推荐</span>' : ''}
                </div>
                <div class="tool-card-content">
                    <div class="flex items-start justify-between mb-2">
                        <span class="tool-card-category text-xs font-medium px-2 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                            <i class="${categoryIcon} mr-1"></i> ${tool.categoryName || tool.category}
                        </span>
                        <span class="text-xs text-gray-500 dark:text-gray-400 tool-card-meta">
                            <i class="fas fa-user-friends mr-1"></i> ${formatNumber(tool.usageCount || 0)}
                        </span>
                    </div>
                    <h3 class="tool-card-title text-gray-900 dark:text-white">
                        ${tool.name}
                    </h3>
                    <p class="tool-card-description text-gray-600 dark:text-gray-300 mb-4 flex-grow">
                        ${tool.description}
                    </p>
                    <a href="tools/${tool.id}.html" class="btn-primary text-sm px-4 py-2 w-full block text-center">
                        使用工具 <i class="fas fa-arrow-right ml-1"></i>
                    </a>
                </div>
            `;
            
            // 添加点击事件
            card.addEventListener('click', (e) => {
                // 如果点击的不是按钮，则导航到工具页面
                if (!e.target.closest('a')) {
                    window.location.href = `tools/${tool.id}.html`;
                }
            });
            
            // 添加到列表
            toolsList.appendChild(card);
        });
    }
    
    // 更新工具数量显示
    function updateToolsCount(count) {
        const toolsCount = document.getElementById('toolsCount');
        if (!toolsCount) return;
        
        toolsCount.textContent = `显示 ${count} 个工具`;
    }
    
    // 显示/隐藏无结果提示
    function toggleNoResultsMessage(show) {
        const noResults = document.getElementById('noResults');
        if (!noResults) return;
        
        if (show) {
            noResults.classList.remove('hidden');
        } else {
            noResults.classList.add('hidden');
        }
    }
})(); 