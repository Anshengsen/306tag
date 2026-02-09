const { useState, useEffect, useRef } = React;

// --- 基础组件 ---

// Icon
const Icon = ({ name, size = 18, className = "" }) => {
    const spanRef = useRef(null);
    
    useEffect(() => {
        if (spanRef.current && window.lucide) {
            const i = document.createElement('i');
            i.setAttribute('data-lucide', name);
            i.setAttribute('width', size);
            i.setAttribute('height', size);
            if(className) i.setAttribute('class', className);
            
            spanRef.current.innerHTML = '';
            spanRef.current.appendChild(i);
            window.lucide.createIcons({
                root: spanRef.current,
                nameAttr: 'data-lucide',
            });
        }
    }, [name, size, className]);

    return <span ref={spanRef} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} />;
};

// Tooltip
const Tooltip = ({ children, content }) => {
    const [visible, setVisible] = useState(false);
    
    return (
        <div 
            className="relative inline-flex items-center"
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
        >
            {children}
            {visible && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-[60] px-2 py-1 text-xs font-medium text-white bg-black dark:bg-neutral-800 rounded shadow-lg whitespace-nowrap animate-fade-in pointer-events-none">
                    {content}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-black dark:border-b-neutral-800"></div>
                </div>
            )}
        </div>
    );
};

// Custom Confirm Dialog
const CustomDialog = ({ isOpen, title, message, onConfirm, onCancel, lang }) => {
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
            <div className="
                w-full max-w-sm rounded-xl p-6 animate-slide-up mx-4
                bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-0
                dark:bg-black dark:shadow-none dark:border dark:border-neutral-800
            ">
                <h3 className="text-lg font-bold mb-2 dark:text-white">{title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed break-words">
                    {message}
                </p>
                <div className="flex justify-end gap-3">
                    <button 
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-900 rounded-lg transition"
                    >
                        {lang === 'zh' ? '取消' : 'Cancel'}
                    </button>
                    <button 
                        onClick={onConfirm}
                        className="px-4 py-2 text-sm font-bold text-white bg-black dark:bg-white dark:text-black rounded-lg hover:opacity-80 transition"
                    >
                        {lang === 'zh' ? '确定' : 'Confirm'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- 弹窗组件 ---
const SettingsModal = ({ isOpen, onClose, apiKey, setApiKey, baseUrl, setBaseUrl, lang }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in p-4">
            <div className="
                w-full max-w-md rounded-xl overflow-hidden animate-slide-up
                bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-0
                dark:bg-black dark:shadow-none dark:border dark:border-neutral-800
            ">
                <div className="p-4 border-b border-gray-100 dark:border-neutral-800 flex justify-between items-center">
                    <h3 className="font-bold text-lg dark:text-white">
                        {lang === 'zh' ? 'AI 设置' : 'AI Settings'}
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-neutral-900 rounded-full dark:text-gray-400 transition-colors">
                        <Icon name="x" size={20} />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    {/* API Key Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Gemini API Key
                        </label>
                        <input 
                            type="password" 
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="AIzaSy..."
                            className="
                                w-full p-3 rounded-lg border outline-none transition
                                bg-gray-50 border-gray-200 text-gray-900 focus:ring-1 focus:ring-black
                                dark:bg-black dark:border-neutral-800 dark:text-white dark:focus:ring-white
                            "
                        />
                        <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                            {lang === 'zh' 
                                ? 'Key 仅保存在本地浏览器中。' 
                                : 'Key is stored locally in your browser.'}
                        </p>
                    </div>

                    {/* Base URL Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            API Endpoint (Base URL)
                        </label>
                        <input 
                            type="text" 
                            value={baseUrl}
                            onChange={(e) => setBaseUrl(e.target.value)}
                            placeholder="https://generativelanguage.googleapis.com"
                            className="
                                w-full p-3 rounded-lg border outline-none transition
                                bg-gray-50 border-gray-200 text-gray-900 focus:ring-1 focus:ring-black
                                dark:bg-black dark:border-neutral-800 dark:text-white dark:focus:ring-white
                            "
                        />
                        <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                            {lang === 'zh' 
                                ? '默认 Google 地址在国内无法直连。如遇网络错误，请尝试使用代理地址 (例如: https://api.gemini-proxy.com) 或开启全局 VPN。' 
                                : 'Default Google URL may be blocked in some regions. Use a proxy URL if needed.'}
                        </p>
                    </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-black border-t border-gray-100 dark:border-neutral-800 text-right">
                    <button 
                        onClick={onClose}
                        className="px-5 py-2 bg-black dark:bg-white text-white dark:text-black hover:opacity-80 rounded-lg font-bold text-sm transition"
                    >
                        {lang === 'zh' ? '保存' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Tag 卡片组件 ---
const TagCard = ({ tag, categoryName, subCategoryName, isSelected, onClick, viewMode, lang }) => {
    const [imgError, setImgError] = useState(false);
    
    // 图片路径：使用中文分类名作为文件夹路径
    // 默认后缀改为 .webp
    const imagePath = `images/${categoryName}/${subCategoryName}/${tag.id}.webp`;

    return (
        <div 
            onClick={() => onClick(tag)}
            className={`
                group relative cursor-pointer transition-all duration-200 
                border rounded-xl overflow-hidden select-none
                ${viewMode === 'text' ? 'p-3 flex items-center justify-between' : 'flex flex-col'}
                ${isSelected 
                    ? 'ring-1 ring-black dark:ring-white border-black dark:border-white bg-gray-50 dark:bg-black' 
                    : 'bg-white dark:bg-black border-gray-200 dark:border-neutral-800 hover:border-gray-400 dark:hover:border-neutral-600'}
            `}
        >
            {viewMode === 'image' && (
                <div className="aspect-square w-full bg-gray-100 dark:bg-[#111] relative overflow-hidden">
                    {!imgError ? (
                        <img 
                            src={imagePath} 
                            alt={tag[lang]} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-600 p-4 text-center">
                            <Icon name="image-off" size={24} className="mb-2 opacity-50"/>
                            <span className="text-xs font-mono opacity-50">NO IMAGE</span>
                        </div>
                    )}
                    {isSelected && (
                        <div className="absolute inset-0 bg-black/10 dark:bg-white/10 flex items-center justify-center">
                            <div className="bg-black dark:bg-white text-white dark:text-black rounded-full w-7 h-7 flex items-center justify-center shadow-sm">
                                <Icon name="check" size={14} />
                            </div>
                        </div>
                    )}
                </div>
            )}
            <div className={`${viewMode === 'image' ? 'p-3 border-t border-gray-100 dark:border-neutral-800' : 'w-full flex justify-between items-center'}`}>
                <div className="flex flex-col">
                    <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
                        {tag[lang]}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500 font-mono mt-0.5">
                        {tag.en}
                    </span>
                </div>
                {viewMode === 'text' && isSelected && (
                     <div className="text-black dark:text-white">
                        <Icon name="check-circle" size={18} />
                     </div>
                )}
            </div>
        </div>
    );
};

// --- 主应用程序 ---
const App = () => {
    // UI State
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('app_theme');
        if (savedTheme) {
            return savedTheme;
        }
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    });

    const [lang, setLang] = useState('zh'); 
    const [viewMode, setViewMode] = useState('image');
    const [showSettings, setShowSettings] = useState(false);
    
    // Confirm Dialog State
    const [dialogConfig, setDialogConfig] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {} });
    
    // Navigation State
    const [activeCategory, setActiveCategory] = useState(DB[0].id);
    const [activeSubCategory, setActiveSubCategory] = useState(DB[0].subcategories[0].id);
    
    // Data State
    const [selectedTags, setSelectedTags] = useState([]); 
    const [outputText, setOutputText] = useState('');
    const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
    const [baseUrl, setBaseUrl] = useState(() => localStorage.getItem('gemini_base_url') || 'https://generativelanguage.googleapis.com');

    // Loading States
    const [isTranslating, setIsTranslating] = useState(false);
    const [isOptimizing, setIsOptimizing] = useState(false);

    // Effects
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('app_theme', theme);
    }, [theme]);

    useEffect(() => {
        // 如果是中文，用中文标签和中文逗号
        // 如果是英文，用英文标签和英文逗号
        let text = '';
        if (lang === 'zh') {
            text = selectedTags.map(t => t.zh).join('，');
        } else {
            text = selectedTags.map(t => t.en).join(', ');
        }
        setOutputText(text);
    }, [selectedTags, lang]);

    useEffect(() => {
        localStorage.setItem('gemini_api_key', apiKey);
        localStorage.setItem('gemini_base_url', baseUrl);
    }, [apiKey, baseUrl]);

    // Custom Dialog Handler
    const openDialog = (title, message, onConfirm) => {
        setDialogConfig({
            isOpen: true,
            title,
            message,
            onConfirm: () => {
                onConfirm();
                setDialogConfig(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const closeDialog = () => {
        setDialogConfig(prev => ({ ...prev, isOpen: false }));
    };

    // Handlers
    const toggleTag = (tag) => {
        setSelectedTags(prev => {
            const exists = prev.find(t => t.id === tag.id);
            return exists ? prev.filter(t => t.id !== tag.id) : [...prev, tag];
        });
    };

    const clearTags = () => {
        openDialog(
            lang === 'zh' ? '清空标签' : 'Clear Tags',
            lang === 'zh' ? '确定要清空所有已选标签吗？此操作无法撤销。' : 'Are you sure you want to clear all tags? This cannot be undone.',
            () => {
                setSelectedTags([]);
                setOutputText('');
            }
        );
    };

    const copyText = () => {
        const textArea = document.createElement("textarea");
        textArea.value = outputText;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            const btn = document.getElementById('copyBtn');
            const originalText = btn.innerHTML;
            btn.innerHTML = `<span class="flex items-center gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>${lang === 'zh' ? '已复制' : 'Copied'}</span>`;
            setTimeout(() => btn.innerHTML = originalText, 2000);
        } catch (err) {
            console.error('Copy failed');
        }
        document.body.removeChild(textArea);
    };

    // --- 功能：翻译 ---
    const handleTranslate = async () => {
        if (!outputText) return;
        setIsTranslating(true);
        
        const hasChinese = /[\u4e00-\u9fa5]/.test(outputText);
        const pair = hasChinese ? 'zh|en' : 'en|zh';
        
        try {
            const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(outputText)}&langpair=${pair}`);
            const data = await res.json();
            if (data.responseData && data.responseData.translatedText) {
                setOutputText(data.responseData.translatedText);
            } else {
                throw new Error('Translation API error');
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsTranslating(false);
        }
    };

    // --- 功能：AI 优化 ---
    const handleOptimize = async () => {
        if (!apiKey) {
            setShowSettings(true);
            return;
        }
        if (!outputText) return;
        
        setIsOptimizing(true);
        try {
            // 使用用户自定义的 Base URL (默认为官方，可改为代理)
            // 使用 gemini-3-flash-preview 模型
            const cleanBaseUrl = baseUrl.replace(/\/+$/, '');
            const response = await fetch(`${cleanBaseUrl}/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `
                                    #角色：
                                    你是一位顶尖的提示词工程大师与图像编辑顾问。你身兼两职：既能像顶级艺术家一样，将模糊创意“翻译”成能激发AI无限潜能的绘画指令；也能像资深后期制作师一样，将口语化的P图要求转化为符合物理逻辑、细节丰富的专业编辑指令。你的核心价值在于精准判断用户意图，并调用相应的专业知识库来提供最佳解决方案。
                                    核心工作流程
                                    这是一个双轨并行的工作流程，由一个核心的“意图识别器”驱动：
                                    第一步：意图识别 (The Dispatcher)
                                    1. 接收用户的原始输入（可能是中文或英文）。
                                    2. 核心判断：分析输入文本。 
                                    ○ 如果文本包含“帮我将图片做成”、“把图里的”、“让这张图”等明确指向已有图像进行修改的关键词，则立即切换到【图像编辑优化】模式。
                                    ○ 否则，默认进入【从零创意优化】模式。
                                    第二步A：【从零创意优化】模式 (Creative Prompting)
                                    (此模式在你提供的第一个范本基础上优化)
                                    1. 分析与复述：深度分析用户的tag或短句，用一句话复述你理解的“用户核心意图”。
                                    2. 策略说明：简要说明你的优化策略（如：增加细节、定义风格、设定光影等）。
                                    3. 结构化重写：将原始想法扩充为一个结构清晰、细节丰富、包含“魔法词”的专业级提示词。
                                    4. 语言匹配：确保输出的提示词语言（中文/英文）与用户输入的语言保持一致。
                                    第二步B：【图像编辑优化】模式 (Image Editing)
                                    (此模式在你提供的第二个范本基础上优化)
                                    1. 解构与规划 (内心活动)：在脑中解构用户的需求，分析涉及的元素、光影、透视、材质，并规划出实现物理真实的视觉效果所需的技术步骤。
                                    2. 专业指令重写：将用户的口语化要求，改写为一段专业、详细、引导AI进行精细操作的指令。这段指令专注于内容和物理逻辑，而非艺术风格。
                                    3. 语言匹配：确保输出的指令语言（中文/英文）与用户输入的语言保持一致。
                                    4. 直接输出：在此模式下，你只输出最终改写后的指令，不包含任何分析过程或解释。

                                    ##规则：
                                    ● 意图识别是第一要务：你必须首先、且准确地判断应该进入哪个工作模式。
                                    ● 语言一致性：输出语言严格跟随输入语言。用户说中文，你回中文；用户说英文，你回英文。
                                    ● 【创意优化】模式要教学：在此模式下，可以顺便包含“核心意图”，让用户知其然并知其所以然，然后再输出提示词。
                                    ● 【图像编辑】模式要直接：在此模式下，必须模仿范例，直接输出最终的、专业级的指令文本，展现出专业人士的干练。
                                    ● 物理真实性优先（编辑模式）：在【图像编辑】模式中，所有改写都以实现视觉和物理逻辑的统一为最高目标。
                                    ● 魔法词慎用（编辑模式）：在【图像编辑】模式中，通常不主动添加“杰作”、“8K”等风格化“魔法词”，除非用户的原始意图暗示了对整体画质的提升要求。

                                    ##输出格式：
                                    当进入【从零创意优化】模式时：
                                    【原始提示词分析】
                                    我理解你的核心意图是：[用一句话精准概括用户的想法]
                                    优化后提示词：[最终的、可直接复制使用的专业级提示词]

                                    当进入【图像编辑优化】模式时：
                                    (你的输出只有下面这部分，且语言与用户输入保持一致)
                                    [一段专业、详细、专注于物理真实感和操作细节的图像编辑指令]
                            
                            Input: "${outputText}"
                            
                            Output (Prompt only):`
                        }]
                    }]
                })
            });
            
            if (!response.ok) {
                 const errData = await response.json().catch(() => ({}));
                 throw new Error(errData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
            
            if (aiText) {
                setOutputText(aiText.trim());
            } else {
                throw new Error('No response from AI');
            }
        } catch (e) {
            console.error(e);
            let errMsg = lang === 'zh' 
                ? '请求失败。' 
                : 'Request failed.';
            
            if (e.message && e.message.includes('Failed to fetch')) {
                errMsg += lang === 'zh' 
                    ? ' 无法连接到服务器。请检查：1. 网络是否通畅；2. 如果在国内，是否开启了全局VPN代理或配置了正确的代理地址。' 
                    : ' Connection failed. Please check your network or proxy settings.';
            } else if (e.message) {
                errMsg += ` (${e.message})`;
            }

            openDialog(
                'AI Error', 
                errMsg,
                () => {}
            );
        } finally {
            setIsOptimizing(false);
        }
    };

    const currentCategoryData = DB.find(c => c.id === activeCategory);
    const currentSubData = currentCategoryData?.subcategories.find(s => s.id === activeSubCategory);

    return (
        <div className="flex flex-col h-screen overflow-hidden selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
            <SettingsModal 
                isOpen={showSettings} 
                onClose={() => setShowSettings(false)} 
                apiKey={apiKey} 
                setApiKey={setApiKey} 
                baseUrl={baseUrl}
                setBaseUrl={setBaseUrl}
                lang={lang}
            />
            
            <CustomDialog 
                isOpen={dialogConfig.isOpen}
                title={dialogConfig.title}
                message={dialogConfig.message}
                onConfirm={dialogConfig.onConfirm}
                onCancel={closeDialog}
                lang={lang}
            />

            {/* Header */}
            <header className="h-16 flex-none bg-instawhite dark:bg-black border-b border-gray-200 dark:border-neutral-800 flex items-center justify-between px-4 z-50 transition-colors">
                <div className="flex items-center gap-3">
                    {/* LOGO Updated to Image */}
                    <img 
                        src="icons/306.png" 
                        alt="306 Tag Logo" 
                        className="w-8 h-8 rounded-lg shadow-sm object-cover" 
                    />
                    <h1 className="font-bold text-xl tracking-tight hidden sm:block dark:text-white">306 Tag</h1>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    <Tooltip content={lang === 'zh' ? '设置' : 'Settings'}>
                        <button 
                            onClick={() => setShowSettings(true)}
                            className={`w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-neutral-900 transition dark:text-white ${!apiKey ? 'animate-pulse' : ''}`}
                        >
                            <Icon name="settings" size={20} />
                        </button>
                    </Tooltip>
                    
                    <div className="w-px h-4 bg-gray-300 dark:bg-neutral-700 mx-1"></div>
                    
                    <Tooltip content={lang === 'zh' ? '切换视图' : 'Toggle View'}>
                        <button 
                            onClick={() => setViewMode(prev => prev === 'text' ? 'image' : 'text')}
                            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-neutral-900 transition dark:text-white"
                        >
                            <Icon name={viewMode === 'text' ? 'layout-list' : 'layout-grid'} size={20} />
                        </button>
                    </Tooltip>

                    <Tooltip content={lang === 'zh' ? '切换语言' : 'Language'}>
                        <button 
                            onClick={() => setLang(prev => prev === 'zh' ? 'en' : 'zh')}
                            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-neutral-900 transition dark:text-white"
                        >
                            <Icon name="languages" size={20} />
                        </button>
                    </Tooltip>

                    <Tooltip content={lang === 'zh' ? '切换主题' : 'Toggle Theme'}>
                        <button 
                            onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
                            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-neutral-900 transition dark:text-white"
                        >
                            <Icon name={theme === 'light' ? 'sun' : 'moon'} size={20} />
                        </button>
                    </Tooltip>
                    
                    <a 
                        href="https://github.com/Anshengsen/306tag" 
                        target="_blank" 
                        className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-neutral-900 transition dark:text-white leading-none no-underline"
                    >
                        <Icon name="github" size={20} />
                    </a>
                </div>
            </header>

            {/* Body */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <nav className="w-16 sm:w-64 flex-none bg-instawhite dark:bg-black border-r border-gray-200 dark:border-neutral-800 flex flex-col overflow-y-auto">
                    {DB.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => {
                                setActiveCategory(cat.id);
                                setActiveSubCategory(cat.subcategories[0].id);
                            }}
                            className={`
                                flex items-center gap-3 p-4 sm:px-6 transition-colors
                                ${activeCategory === cat.id 
                                    ? 'text-black dark:text-white font-bold bg-gray-50 dark:bg-black border-r-4 border-black dark:border-white' 
                                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-900/50'}
                            `}
                        >
                            <div className="flex-none"><Icon name="hash" size={20} /></div>
                            <span className="hidden sm:block truncate">{cat.name[lang]}</span>
                        </button>
                    ))}
                </nav>

                {/* Content */}
                <main className="flex-1 flex flex-col min-w-0 bg-white dark:bg-black relative">
                    <div className="h-14 flex-none border-b border-gray-200 dark:border-neutral-800 flex items-center px-4 gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide bg-white/95 dark:bg-black/95 backdrop-blur z-10 sticky top-0">
                        {currentCategoryData?.subcategories.map(sub => (
                            <button
                                key={sub.id}
                                onClick={() => setActiveSubCategory(sub.id)}
                                className={`
                                    px-4 py-1.5 rounded-full text-sm font-medium transition-colors border
                                    ${activeSubCategory === sub.id
                                        ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 dark:bg-black dark:text-gray-400 dark:border-neutral-800 dark:hover:border-neutral-600'}
                                `}
                            >
                                {sub.name[lang]}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                        <div className={`grid gap-4 ${viewMode === 'image' ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
                            {currentSubData?.tags.map(tag => (
                                <TagCard 
                                    key={tag.id}
                                    tag={tag}
                                    categoryName={currentCategoryData.name.zh}
                                    subCategoryName={currentSubData.name.zh}
                                    categoryId={activeCategory}
                                    subCategoryId={activeSubCategory}
                                    isSelected={selectedTags.some(t => t.id === tag.id)}
                                    onClick={toggleTag}
                                    viewMode={viewMode}
                                    lang={lang}
                                />
                            ))}
                        </div>
                        <div className="h-48 sm:h-0"></div>
                    </div>
                </main>

                {/* Right Sidebar */}
                <aside className="
                    fixed bottom-0 left-0 right-0 sm:static sm:w-80 flex-none
                    bg-white dark:bg-black border-t sm:border-t-0 sm:border-l border-gray-200 dark:border-neutral-800
                    flex flex-col z-30 shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)] sm:shadow-none
                    h-[45vh] sm:h-full transition-all
                ">
                    <div className="h-14 flex-none px-4 flex items-center justify-between border-b border-gray-100 dark:border-neutral-800 bg-gray-50 dark:bg-black">
                        <span className="font-bold flex items-center gap-2 dark:text-white">
                            <Icon name="shopping-bag" size={18}/>
                            <span className="text-sm">{lang === 'zh' ? '已选标签' : 'Cart'}</span>
                            <span className="bg-black dark:bg-white text-white dark:text-black text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                                {selectedTags.length}
                            </span>
                        </span>
                        <button onClick={clearTags} className="text-xs text-gray-500 hover:text-red-500 font-medium transition dark:text-gray-400 dark:hover:text-red-400">
                            {lang === 'zh' ? '清空' : 'Clear'}
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 gap-2 flex flex-wrap content-start bg-white dark:bg-black">
                        {selectedTags.length === 0 ? (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 dark:text-gray-700">
                                <Icon name="mouse-pointer-2" size={32} className="mb-2 opacity-50"/>
                                <p className="text-xs font-medium">{lang === 'zh' ? '点击左侧选择标签' : 'Select tags'}</p>
                            </div>
                        ) : (
                            selectedTags.map(tag => (
                                <span 
                                    key={tag.id}
                                    onClick={() => toggleTag(tag)}
                                    className="
                                        inline-flex items-center gap-1 px-2.5 py-1.5 
                                        text-xs font-medium rounded-md cursor-pointer group transition-all
                                        bg-white text-black border border-gray-200 hover:border-red-400 hover:text-red-500
                                        dark:bg-black dark:text-white dark:border-white dark:hover:border-red-500 dark:hover:text-red-400
                                    "
                                >
                                    {lang === 'zh' ? tag.zh : tag.en}
                                    <Icon name="x" size={12} className="opacity-30 group-hover:opacity-100 transition-opacity"/>
                                </span>
                            ))
                        )}
                    </div>

                        <div className="px-4 py-3 border-t border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-black">
                            <div className="flex justify-between items-center mb-3">
                            <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Prompt</label>
                            <div className="flex gap-2">
                                <Tooltip content={lang === 'zh' ? '使用 Gemini 优化提示词' : 'Optimize with Gemini'}>
                                    <button 
                                        onClick={handleOptimize}
                                        disabled={isOptimizing}
                                        className="
                                            text-xs flex items-center gap-1.5 px-3 py-1 rounded-md border transition-all
                                            bg-white text-black border-gray-200 hover:border-black
                                            dark:bg-black dark:text-white dark:border-gray-700 dark:hover:border-white
                                            disabled:opacity-50 disabled:cursor-not-allowed
                                        "
                                    >
                                        {isOptimizing ? <span className="loading-dots">AI</span> : <><Icon name="sparkles" size={12}/> {lang === 'zh' ? 'AI 优化' : 'Optimize'}</>}
                                    </button>
                                </Tooltip>
                                
                                <Tooltip content={lang === 'zh' ? '中英互译' : 'Translate'}>
                                    <button 
                                        onClick={handleTranslate}
                                        disabled={isTranslating}
                                        className="
                                            text-xs flex items-center gap-1.5 px-3 py-1 rounded-md border transition-all
                                            bg-white text-black border-gray-200 hover:border-black
                                            dark:bg-black dark:text-white dark:border-gray-700 dark:hover:border-white
                                            disabled:opacity-50 disabled:cursor-not-allowed
                                        "
                                    >
                                        {isTranslating ? '...' : <><Icon name="languages" size={12}/> {lang === 'zh' ? '翻译' : 'Trans'}</>}
                                    </button>
                                </Tooltip>
                            </div>
                        </div>
                        
                        {/* Prompt Input Area: Increased height (h-40) & added resizable capability (resize-y) */}
                        <textarea 
                            value={outputText}
                            onChange={(e) => setOutputText(e.target.value)}
                            className="
                                w-full h-40 p-3 rounded-lg text-sm font-mono leading-relaxed resize-y
                                bg-white dark:bg-black border border-gray-300 dark:border-neutral-700
                                text-gray-900 dark:text-gray-100 
                                focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white
                                transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-600
                            "
                            placeholder={lang === 'zh' ? "在此输入..." : "Enter prompt..."}
                        ></textarea>
                        
                        <button 
                            id="copyBtn"
                            onClick={copyText}
                            className="
                                w-full mt-3 py-2.5 rounded-lg font-bold text-sm shadow-sm
                                bg-black text-white hover:opacity-80
                                dark:bg-white dark:text-black dark:hover:opacity-90
                                flex items-center justify-center gap-2 transition-all active:scale-[0.98]
                            "
                        >
                            <Icon name="copy" size={16}/>
                            {lang === 'zh' ? '复制' : 'Copy'}
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);