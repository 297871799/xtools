/**
 * 主要应用逻辑
 * 处理工具数据加载、动态渲染和交互功能
 */
(function() {
    // 工具数据缓存
    let toolsData = [];
    let categoriesData = [];
    
    // DOM 加载完成后初始化
    document.addEventListener('DOMContentLoaded', init);
    
    // 初始化应用
    async function init() {
        // 绑定移动端菜单切换
        bindMobileMenu();
        
        // 加载并渲染工具数据
        await loadAndRenderData();
        
        // 添加动画效果
        addAnimationEffects();
        
        // 监听主题变化
        setupThemeObserver();
        
        // 初始应用主题到动态元素
        setTimeout(applyThemeToElements, 500);
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
    
    // 加载并渲染数据
    async function loadAndRenderData() {
        try {
            // 加载工具和分类数据
            await Promise.all([
                loadToolsData(),
                loadCategoriesData()
            ]);
            
            // 渲染各部分内容
            renderFeaturedTools();
            renderToolCategories();
            renderTestimonials();
            
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }
    
    // 加载工具数据
    async function loadToolsData() {
        try {
            // 这里我们使用模拟数据，实际应用中应该从API获取
            toolsData = [
                {
                    id: 'image-converter',
                    name: '图像格式转换器',
                    description: '轻松转换图像格式，支持JPG、PNG、WebP、AVIF等多种格式间的互相转换。',
                    category: 'media',
                    categoryName: '媒体处理',
                    image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                    featured: true,
                    usageCount: 15287
                },
                {
                    id: 'code-formatter',
                    name: '代码格式化工具',
                    description: '一键美化各种编程语言代码，提高代码可读性和一致性。',
                    category: 'development',
                    categoryName: '开发工具',
                    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                    featured: true,
                    usageCount: 12459
                },
                {
                    id: 'pdf-tools',
                    name: 'PDF工具箱',
                    description: '多功能PDF处理工具，支持PDF合并、拆分、压缩、转换等操作。',
                    category: 'productivity',
                    categoryName: '生产力工具',
                    image: 'https://images.unsplash.com/photo-1568667256549-094345857637?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                    featured: true,
                    usageCount: 18734
                },
                {
                    id: 'text-analyzer',
                    name: '文本分析工具',
                    description: '深入分析文本内容，提供字数统计、关键词提取、情感分析等功能。',
                    category: 'utility',
                    categoryName: '实用工具',
                    image: 'https://images.unsplash.com/photo-1518976024611-28bf4b48222e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                    featured: false,
                    usageCount: 9876
                },
                {
                    id: 'color-picker',
                    name: '高级取色器',
                    description: '专业的颜色选择和管理工具，支持多种颜色模式和调色板保存。',
                    category: 'design',
                    categoryName: '设计工具',
                    image: 'https://images.unsplash.com/photo-1579547945413-497e1b99dac0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                    featured: true,
                    usageCount: 11345
                },
                {
                    id: 'json-formatter',
                    name: 'JSON格式化工具',
                    description: '轻松格式化和验证JSON数据，提高开发效率。',
                    category: 'development',
                    categoryName: '开发工具',
                    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                    featured: false,
                    usageCount: 14256
                },
                {
                    id: 'video-compressor',
                    name: '视频压缩工具',
                    description: '高效压缩视频文件，减小体积同时保持高质量。',
                    category: 'media',
                    categoryName: '媒体处理',
                    image: 'https://images.unsplash.com/photo-1626379953822-baec19c3accd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                    featured: true,
                    usageCount: 10234
                },
                {
                    id: 'password-generator',
                    name: '密码生成器',
                    description: '创建安全、强大的随机密码，提高账户安全性。',
                    category: 'security',
                    categoryName: '安全工具',
                    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                    featured: false,
                    usageCount: 16789
                },
                {
                    id: 'markdown-editor',
                    name: 'Markdown编辑器',
                    description: '功能强大的Markdown编辑器，支持实时预览和导出多种格式。',
                    category: 'productivity',
                    categoryName: '生产力工具',
                    image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                    featured: false,
                    usageCount: 8765
                },
                {
                    id: 'image-editor',
                    name: '在线图像编辑器',
                    description: '专业的在线图像编辑工具，提供裁剪、滤镜、调整等多种功能。',
                    category: 'design',
                    categoryName: '设计工具',
                    image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                    featured: true,
                    usageCount: 20123
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
            // 基于工具数据生成分类数据
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
    
    // 渲染精选工具
    function renderFeaturedTools() {
        const container = document.getElementById('featuredTools');
        if (!container) return;
        
        const featuredTools = toolsData.filter(tool => tool.featured);
        
        if (featuredTools.length === 0) {
            container.innerHTML = '<p class="text-center col-span-full text-gray-500 dark:text-gray-400">暂无精选工具</p>';
            return;
        }
        
        container.innerHTML = featuredTools.map((tool, index) => `
            <div class="tool-card animate-fade-in" style="animation-delay: ${index * 100}ms">
                <div class="relative overflow-hidden">
                    <img src="${tool.image}" alt="${tool.name}" class="tool-card-image">
                    <div class="absolute top-2 right-2 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                        <i class="fas fa-star mr-1"></i> 精选
                    </div>
                </div>
                <div class="tool-card-content">
                    <h3 class="tool-card-title">${tool.name}</h3>
                    <p class="tool-card-description">${tool.description}</p>
                    <div class="tool-card-footer">
                        <span class="tool-card-category">${tool.categoryName}</span>
                        <a href="tools/${tool.id}.html" class="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
                            查看详情 <i class="fas fa-arrow-right ml-1"></i>
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    // 渲染工具分类
    function renderToolCategories() {
        const container = document.getElementById('toolCategories');
        if (!container) return;
        
        if (categoriesData.length === 0) {
            container.innerHTML = '<p class="text-center col-span-full text-gray-500 dark:text-gray-400">暂无分类数据</p>';
            return;
        }
        
        container.innerHTML = categoriesData.map((category, index) => `
            <div class="category-card animate-fade-in" style="animation-delay: ${index * 100}ms">
                <div class="category-icon">
                    <i class="${category.icon}"></i>
                </div>
                <h3 class="category-title">${category.name}</h3>
                <p class="category-count">${category.count} 个工具</p>
                <a href="tools.html?category=${category.id}" class="mt-3 text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
                    浏览工具 <i class="fas fa-arrow-right ml-1"></i>
                </a>
            </div>
        `).join('');
    }
    
    // 渲染用户评价
    function renderTestimonials() {
        const container = document.getElementById('testimonials');
        if (!container) return;
        
        // 模拟评价数据
        const testimonials = [
            {
                content: "XTools的PDF工具箱帮我节省了大量处理文档的时间，功能全面且易于使用，强烈推荐！",
                name: "张明",
                role: "项目经理",
                avatar: "https://randomuser.me/api/portraits/men/32.jpg"
            },
            {
                content: "作为一名设计师，我每天都在使用XTools的图像编辑器。界面直观，功能强大，是我工作流程中不可或缺的工具。",
                name: "李娜",
                role: "UI设计师",
                avatar: "https://randomuser.me/api/portraits/women/44.jpg"
            },
            {
                content: "开发中经常需要格式化JSON数据，XTools的JSON格式化工具简单高效，让我的工作效率提高了不少。",
                name: "王磊",
                role: "前端开发者",
                avatar: "https://randomuser.me/api/portraits/men/22.jpg"
            }
        ];
        
        container.innerHTML = testimonials.map((testimonial, index) => `
            <div class="testimonial-card animate-fade-in" style="animation-delay: ${index * 100}ms">
                <p class="testimonial-content">"${testimonial.content}"</p>
                <div class="testimonial-author">
                    <img src="${testimonial.avatar}" alt="${testimonial.name}" class="testimonial-avatar">
                    <div class="testimonial-info">
                        <span class="testimonial-name">${testimonial.name}</span>
                        <span class="testimonial-role">${testimonial.role}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    // 添加动画效果
    function addAnimationEffects() {
        // 滚动时渐入效果
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        // 对需要动画的元素应用观察器
        document.querySelectorAll('.tool-card, .category-card, .testimonial-card').forEach(el => {
            observer.observe(el);
        });
    }
    
    // 主题应用于动态生成的元素
    function applyThemeToElements() {
        // 确保所有动态生成的卡片使用主题变量
        document.querySelectorAll('.tool-card, .category-card').forEach(card => {
            card.style.backgroundColor = 'var(--card-bg)';
            card.style.borderColor = 'var(--border-color)';
            
            // 标题和描述
            const title = card.querySelector('.tool-card-title, .category-title');
            if (title) title.style.color = 'var(--primary-text)';
            
            const description = card.querySelector('.tool-card-description, .category-count');
            if (description) description.style.color = 'var(--secondary-text)';
            
            // 分类标签
            const category = card.querySelector('.tool-card-category');
            if (category) category.style.color = 'var(--accent-color)';
            
            // 图标
            const icon = card.querySelector('.category-icon');
            if (icon) icon.style.color = 'var(--accent-color)';
        });
        
        // 确保评价卡片使用主题变量
        document.querySelectorAll('.testimonial-card').forEach(card => {
            card.style.backgroundColor = 'var(--card-bg)';
            card.style.borderColor = 'var(--border-color)';
            
            const content = card.querySelector('.testimonial-content');
            if (content) content.style.color = 'var(--primary-text)';
            
            const name = card.querySelector('.testimonial-name');
            if (name) name.style.color = 'var(--primary-text)';
            
            const role = card.querySelector('.testimonial-role');
            if (role) role.style.color = 'var(--secondary-text)';
        });
    }
    
    // 监听主题变化
    function setupThemeObserver() {
        // 创建一个MutationObserver来监听data-theme属性变化
        const observer = new MutationObserver(() => {
            // 当主题变化时应用主题到动态元素
            applyThemeToElements();
        });
        
        // 开始观察document元素的data-theme属性变化
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    }
    
    // 导出公共函数（用于其他模块）
    window.app = {
        loadToolsData,
        loadCategoriesData
    };
})(); 