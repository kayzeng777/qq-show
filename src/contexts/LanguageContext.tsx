import React, { createContext, useContext, useState, type ReactNode } from 'react';

// 直接在这里定义类型和翻译，避免循环导入
export type Language = 'zh' | 'en';

// 直接定义翻译对象
const translations = {
  zh: {
    app: {
      title: 'QQ秀2000',
      about: '关于',
      clearAll: '一键清空',
      undo: '撤销',
      redo: '重做',
      randomStyle: '随机搭配',
      selectCategory: '选择一个分类来查看装扮物品',
      none: '无',
      categoryTitle: '装扮分类',
    },
    categories: {
      background: '背景',
      backgroundDecor: '背景装饰',
      vehicle: '车',
      wings: '翅膀',
      hair: '发型',
      backHair: '后头发',
      bottom: '下装',
      top: '上装',
      outfit: '套装',
      fullFace: '妆容',
      fullHead: '妆发造型',
      frontHair: '前头发',
      faceDecor: '脸饰',
      earrings: '耳饰',
      glasses: '眼镜墨镜',
      necklace: '颈饰',
      headwear: '头饰',
      otherAccessories: '其他配饰',
      companion: '陪伴',
      frame: '边框',
      textDecor: '装饰字',
      sparkle: '特效',
    },
    about: {
      title: '关于 QQ秀2000',
      description: 'QQ秀2000 是一个复古风格的虚拟形象搭配工具，灵感来源于经典的QQ秀系统。',
      features: '功能特点：',
      featureList: [
        '多种服装和配饰选择',
        '实时预览搭配效果',
        '撤销/重做功能',
        '随机搭配功能',
        '一键清空功能',
      ],
      conclusion: '享受搭配的乐趣，创造属于你的独特形象！',
    },
  },
  en: {
    app: {
      title: 'QQ Show 2000',
      about: 'About',
      clearAll: 'Clear all',
      undo: 'Undo',
      redo: 'Redo',
      randomStyle: 'Random Style',
      selectCategory: 'Select a category to view styling items',
      none: 'None',
      categoryTitle: 'Categories',
    },
    categories: {
      background: 'Background',
      backgroundDecor: 'Background Decor',
      vehicle: 'Vehicle',
      wings: 'Wings',
      hair: 'Hairstyles',
      backHair: 'Back Hair',
      bottom: 'Bottom',
      top: 'Top',
      outfit: 'Outfit Set',
      fullFace: 'Makeup',
      fullHead: 'Head Set',
      frontHair: 'Front Hair',
      faceDecor: 'Face Decor',
      earrings: 'Earrings',
      glasses: 'Glasses',
      necklace: 'Necklace',
      headwear: 'Headwear',
      otherAccessories: 'Other Accessories',
      companion: 'Companion',
      frame: 'Frame',
      textDecor: 'Text Decor',
      sparkle: 'Effects',
    },
    about: {
      title: 'About QQ Show 2000',
      description: 'QQ Show 2000 is a retro-style virtual avatar styling tool, inspired by the classic QQ Show system.',
      features: 'Features:',
      featureList: [
        'Multiple clothing and accessory options',
        'Real-time preview of styling effects',
        'Undo/Redo functionality',
        'Random styling feature',
        'One-click clear function',
      ],
      conclusion: 'Enjoy the fun of styling and create your unique avatar!',
    },
  },
};

export type TranslationKeys = typeof translations.zh;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationKeys;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('zh');
  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
