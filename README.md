# XTools 工具集网站

一个简约大气、科技感十足的工具集网站，展示我们自主开发的各种实用工具。网站采用现代化的设计，支持多语言和主题切换，提供了良好的用户体验。

## 主要特性

- **响应式设计**：适配各种屏幕尺寸，从移动设备到桌面平台
- **多语言支持**：支持中文、英文、日文和韩文
- **主题切换**：可切换深色/浅色模式，以及多种颜色主题
- **工具分类**：按功能清晰分类展示工具
- **搜索和筛选**：快速查找所需工具
- **工具详情展示**：详细展示每个工具的功能和使用方法

## 技术栈

- HTML5 + CSS3
- Tailwind CSS：用于快速构建现代化界面
- JavaScript：原生JS实现交互功能
- Font Awesome：提供丰富的图标支持

## 项目结构

```
xtools-website/
├── index.html           # 网站首页
├── tools.html           # 工具列表页
├── about.html           # 关于我们页面
├── css/                 # 样式文件
│   ├── style.css        # 主要样式
│   └── themes.css       # 主题相关样式
├── js/                  # JavaScript文件
│   ├── main.js          # 主要功能
│   ├── theme.js         # 主题切换功能
│   ├── i18n.js          # 国际化功能
│   └── tools.js         # 工具列表页功能
├── tools/               # 工具详情页
│   └── image-converter.html # 图像格式转换器详情页
├── locales/             # 语言文件
│   ├── zh/              # 中文
│   │   └── translations.json
│   └── en/              # 英文
│       └── translations.json
├── assets/              # 资源文件
│   ├── icons/           # 图标文件
│   └── images/          # 图片文件
└── README.md            # 项目说明
```

## 页面概览

1. **首页 (index.html)**：展示网站介绍、精选工具、工具分类和用户评价
2. **工具列表页 (tools.html)**：展示所有工具，支持搜索、分类筛选和排序
3. **工具详情页 (tools/xxx.html)**：展示具体工具的详细信息、功能特点、使用方法和演示
4. **关于我们页 (about.html)**：介绍团队、公司历史和联系方式

## 本地运行

由于项目是纯前端实现，无需构建步骤，可以直接在浏览器中打开HTML文件或使用简单的HTTP服务器运行：

```bash
# 使用Python的HTTP服务器（Python 3）
python -m http.server 8000

# 使用Node.js的http-server（需先安装）
npx http-server -p 8000
```

然后在浏览器中访问 `http://localhost:8000` 即可查看网站。

## 自定义和扩展

### 添加新工具

1. 在 `tools/` 目录下创建新的HTML文件，可以参考现有工具页面的结构
2. 在 `js/main.js` 和 `js/tools.js` 中的工具数据数组中添加新工具的信息
3. 确保添加对应的图片资源

### 添加新语言

1. 在 `locales/` 目录下创建新的语言文件夹（如 `fr/` 表示法语）
2. 复制现有的 `translations.json` 并翻译其中的内容
3. 在 `js/i18n.js` 中的 `supportedLanguages` 数组中添加新语言代码

## 许可证

MIT License 

# xtools
