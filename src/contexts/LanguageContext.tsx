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
      description: 'QQ Show was a virtual avatar dress-up feature launched by Tencent in 2003 and shut down in 2021. Users could customize their digital personas with clothing and accessories that appeared in QQ chats.',
      features: 'QQ Show was directly inspired by Sayclub, one of Korea\'s biggest chat platforms in the 2000s, which lost its ground 10 years later. In a different trajectory, Tencent won its home market with its technology and product strategy. QQ Show achieved massive scale in China, attracting over 100 million users and establishing virtual goods as a major revenue stream.',
      featureList: [
        'The aesthetic featured the "purikura" and "blingee" style popular in early 2000s Asia—sparkly graphics, bright colors, and maximalist design elements that were part of the broader Y2K cultural movement.',
        'Despite shaping the internet culture and aesthetic for hundreds of millions of users in China, QQ Show remains relatively unknown outside the Chinese internet spheres.',
        'This project recreates QQ Show using gif assets recovered from the Internet Archive Wayback Machine, aiming to make its mark on internet history visible to the global internet community.',
      ],
      conclusion: 'All assets recovered from the Internet Archive Wayback Machine. Copyright remains with Tencent. Made by <a href="https://www.instagram.com/kayzeng777" target="_blank" rel="noopener noreferrer">Kay Zeng</a>, thinking about the QQ Show she bought with her snack money.',
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
      description: 'QQ Show was a virtual avatar dress-up feature launched by Tencent in 2003 and shut down in 2021. Users could customize their digital personas with clothing and accessories that appeared in QQ chats.',
      features: 'QQ Show was directly inspired by Sayclub, one of Korea\'s biggest chat platforms in the 2000s, which lost its ground 10 years later. In a different trajectory, Tencent won its home market with its technology and product strategy. QQ Show achieved massive scale in China, attracting over 100 million users and establishing virtual goods as a major revenue stream.',
      featureList: [
        'The aesthetic featured the "purikura" and "blingee" style popular in early 2000s Asia—sparkly graphics, bright colors, and maximalist design elements that were part of the broader Y2K cultural movement.',
        'Despite shaping the internet culture and aesthetic for hundreds of millions of users in China, QQ Show remains relatively unknown outside the Chinese internet spheres.',
        'This project recreates QQ Show using gif assets recovered from the Internet Archive Wayback Machine, aiming to make its mark on internet history visible to the global internet community.',
      ],
      conclusion: 'All assets recovered from the Internet Archive Wayback Machine. Copyright remains with Tencent. Made by <a href="https://www.instagram.com/kayzeng777" target="_blank" rel="noopener noreferrer">Kay Zeng</a>, thinking about the QQ Show she bought with her snack money.',
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
