/**
 * 国际化(i18n)模块
 * 处理多语言切换和文本本地化
 */
(function() {
    // 支持的语言列表
    const supportedLanguages = ['zh', 'en', 'ja', 'ko'];
    
    // 默认语言
    const defaultLanguage = 'zh';
    
    // 当前语言
    let currentLang = localStorage.getItem('xtools-lang') || defaultLanguage;
    
    // 语言数据缓存
    const languageData = {};
    
    // 初始化国际化功能
    async function init() {
        // 检测语言设置并应用
        await setLanguage(currentLang);
        
        // 绑定语言切换事件
        bindLanguageSelector();
    }
    
    // 加载语言数据
    async function loadLanguageData(lang) {
        // 如果已经缓存了该语言的数据，直接返回
        if (languageData[lang]) {
            return languageData[lang];
        }
        
        try {
            // 从服务器加载语言数据
            const response = await fetch(`locales/${lang}/translations.json`);
            
            if (!response.ok) {
                throw new Error(`Failed to load language data for ${lang}`);
            }
            
            const data = await response.json();
            languageData[lang] = data;
            return data;
        } catch (error) {
            console.error('Error loading language data:', error);
            
            // 如果加载失败且不是默认语言，尝试加载默认语言
            if (lang !== defaultLanguage) {
                return loadLanguageData(defaultLanguage);
            }
            
            // 如果是默认语言加载失败，返回空对象
            return {};
        }
    }
    
    // 设置语言
    async function setLanguage(lang) {
        // 验证语言是否支持
        if (!supportedLanguages.includes(lang)) {
            lang = defaultLanguage;
        }
        
        // 加载语言数据
        const translations = await loadLanguageData(lang);
        
        // 更新当前语言
        currentLang = lang;
        localStorage.setItem('xtools-lang', lang);
        
        // 更新页面文本
        updatePageText(translations);
        
        // 更新HTML lang属性
        document.documentElement.setAttribute('lang', lang);
        
        // 更新语言选择器状态
        updateLanguageSelectorState();
        
        return true;
    }
    
    // 更新页面文本
    function updatePageText(translations) {
        // 处理具有data-i18n属性的元素
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = getNestedTranslation(translations, key);
            
            if (translation) {
                element.textContent = translation;
            }
        });
        
        // 处理具有data-i18n-placeholder属性的元素
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const translation = getNestedTranslation(translations, key);
            
            if (translation) {
                element.setAttribute('placeholder', translation);
            }
        });
        
        // 处理具有data-i18n-title属性的元素
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            const translation = getNestedTranslation(translations, key);
            
            if (translation) {
                element.setAttribute('title', translation);
            }
        });
    }
    
    // 获取嵌套的翻译内容
    function getNestedTranslation(translations, key) {
        const keys = key.split('.');
        let result = translations;
        
        for (const k of keys) {
            if (result && typeof result === 'object' && k in result) {
                result = result[k];
            } else {
                return null;
            }
        }
        
        return result;
    }
    
    // 绑定语言选择器事件
    function bindLanguageSelector() {
        const languageSelector = document.getElementById('languageSelector');
        
        if (!languageSelector) return;
        
        // 点击语言选择器按钮时显示/隐藏下拉菜单
        const selectorButton = languageSelector.querySelector('button');
        const dropdown = languageSelector.querySelector('.language-dropdown');
        
        if (selectorButton && dropdown) {
            selectorButton.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown.classList.toggle('hidden');
            });
            
            // 点击页面其他地方时关闭下拉菜单
            document.addEventListener('click', () => {
                dropdown.classList.add('hidden');
            });
            
            // 点击下拉菜单内部时阻止冒泡
            dropdown.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
        
        // 绑定语言切换选项的点击事件
        document.querySelectorAll('.lang-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = option.getAttribute('data-lang');
                setLanguage(lang);
                
                // 切换后隐藏下拉菜单
                if (dropdown) {
                    dropdown.classList.add('hidden');
                }
            });
        });
        
        // 初始化语言选择器状态
        updateLanguageSelectorState();
    }
    
    // 更新语言选择器状态
    function updateLanguageSelectorState() {
        document.querySelectorAll('.lang-option').forEach(option => {
            const lang = option.getAttribute('data-lang');
            
            if (lang === currentLang) {
                option.classList.add('font-bold', 'bg-gray-100', 'dark:bg-gray-700');
            } else {
                option.classList.remove('font-bold', 'bg-gray-100', 'dark:bg-gray-700');
            }
        });
    }
    
    // 获取当前语言的翻译
    function getTranslation(key) {
        const translations = languageData[currentLang] || {};
        return getNestedTranslation(translations, key);
    }
    
    // 导出i18n相关函数（用于其他模块）
    window.i18n = {
        setLanguage,
        getCurrentLanguage: () => currentLang,
        getSupportedLanguages: () => [...supportedLanguages],
        getTranslation
    };
    
    // 初始化i18n模块
    init();
})(); 