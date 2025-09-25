import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

// 直接在这里定义类型和翻译，避免循环导入
export type Language = "zh" | "en";

// 直接定义翻译对象
const translations = {
  zh: {
    app: {
      title: "QQ秀2000",
      about: "关于",
      shareOutfit: "分享装扮",
      createYourOwn: "创建装扮",
      clearAll: "一键清空",
      undo: "撤销",
      redo: "重做",
      randomStyle: "随机搭配",
      selectCategory: "选择一个分类来查看装扮物品",
      none: "无",
      categoryTitle: "装扮分类",
      defaultOutfitName: "我的装扮",
      save: "保存",
    },
    categories: {
      backgrounds: "背景",
      "background-decor": "背景装饰",
      vehicle: "车",
      wings: "翅膀",
      hair: "发型",
      backHair: "后头发",
      bottom: "下装",
      top: "上装",
      outfit: "套装",
      makeup: "妆容",
      "head-set": "妆发造型",
      frontHair: "前头发",
      "face-decor": "脸饰",
      earrings: "耳饰",
      glasses: "眼镜墨镜",
      neckwear: "颈饰",
      headwear: "头饰",
      "other-accessories": "其他配饰",
      companion: "陪伴",
      frame: "边框",
      text: "文字装饰",
      sparkle: "特效",
    },
    about: {
      title: "关于 QQ秀2000",
      description:
        '<a href="https://en.wikipedia.org/wiki/Tencent_QQ" target="_blank" rel="noopener noreferrer">QQ</a>是腾讯于1999年创建的中国聊天社交平台。在2003年，腾讯推出了虚拟形象装扮产品QQ秀，用户可以为自己在QQ世界中的数字化身搭配服装和配饰。直至2021年，QQ秀被腾讯下架。\n\nQQ秀的创建借鉴了Sayclub，2000年代韩国最大的聊天平台之一。Sayclub在后来由于竞争和未能适应新兴的智能手机时代而在韩国逐渐失去了市场地位。腾讯则走向了不同的轨迹，凭借其技术和产品策略赢得了本土市场竞争。QQ秀在中国取得了巨大成功，吸引了超过1亿用户，并确立了虚拟商品作为主要收入来源的商业模式。\n\n其美学风格具有2000年代初期亚洲流行的"大头贴"和"闪图"特色——闪闪发光的图形、明亮的色彩和极繁主义设计元素，这些都是更广泛的Y2K文化运动的一部分。\n\n尽管QQ秀影响了中国数亿用户和早期的中国互联网文化审美，但在中文互联网以外仍相对不为人知。此项目使用从<a href="https://archive.org/" target="_blank" rel="noopener noreferrer">Internet Archive Wayback Machine</a>恢复收集的gif素材重现QQ秀，旨在让中国互联网历史上的这一印记被更广阔的互联网社区看见。',
      disclaimers:
        "这是一个非官方、非营利的数字档案项目，仅用于艺术、教育和研究目的。所有素材均从Internet Archive Wayback Machine中恢复收集。版权归腾讯控股有限公司所有。如需删除下架，请联系qqshow2000project@gmail.com。",
      colophon:
        'qqshow2000.com由<a href="https://www.instagram.com/kayzeng777/" target="_blank" rel="noopener noreferrer">Kay Zeng</a>设计制作。时至今日，她已经忘记了自己曾在QQ秀和各种钻石会员上花了多少钱。',
      timeline: "最近更新：2025年9月23日，上线时间：2025年9月22日",
    },
  },
  en: {
    app: {
      title: "QQ Show 2000",
      about: "About",
      shareOutfit: "Share Outfit",
      createYourOwn: "Create Outfit",
      clearAll: "Clear all",
      undo: "Undo",
      redo: "Redo",
      randomStyle: "Random Style",
      selectCategory: "Select a category to view styling items",
      none: "None",
      categoryTitle: "Categories",
      defaultOutfitName: "My Outfit",
      save: "Save",
    },
    categories: {
      backgrounds: "Background",
      "background-decor": "Background Decor",
      vehicle: "Vehicle",
      wings: "Wings",
      hair: "Hairstyles",
      backHair: "Back Hair",
      bottom: "Bottom",
      top: "Top",
      outfit: "Outfit Set",
      makeup: "Makeup",
      "head-set": "Head Set",
      frontHair: "Front Hair",
      "face-decor": "Face Decor",
      earrings: "Earrings",
      glasses: "Glasses",
      neckwear: "Neckwear",
      headwear: "Headwear",
      "other-accessories": "Other Accessories",
      companion: "Companion",
      frame: "Frame",
      text: "Text Decor",
      sparkle: "Effects",
    },
    about: {
      title: "About QQ Show 2000",
      description:
        '<a href="https://en.wikipedia.org/wiki/Tencent_QQ" target="_blank" rel="noopener noreferrer">QQ</a> is a Chinese chat and social media platform created by Tencent in 1999. In 2003, Tencent launched QQ Show, a virtual avatar dress-up feature that remained active until 2021. Users could customize their digital personas with clothing and accessories that appeared in the QQ world.\n\nQQ Show was directly inspired by Sayclub, one of Korea\'s biggest chat platforms in the 2000s, which gradually lost its ground a decade later due to competition and failed to adapt to the emerging smartphone era. In a different trajectory, Tencent won its home market with its technology and product strategy. QQ Show achieved massive scale in China, attracting over 100 million users and establishing virtual goods as a major revenue stream.\n\nThe aesthetic featured the "purikura" and "blingee" style popular in early 2000s Asia—sparkly graphics, bright colors, and maximalist design elements that were part of the broader Y2K cultural movement.\n\nDespite shaping the internet culture and aesthetic for hundreds of millions of users in China, QQ Show remains relatively unknown outside the Chinese internet spheres. This project recreates QQ Show using gif assets recovered from the <a href="https://archive.org/" target="_blank" rel="noopener noreferrer">Internet Archive Wayback Machine</a>, aiming to make its mark on Chinese internet history visible to the international internet community.',
      disclaimers:
        "This is an unofficial, non-profit digital archive project for artistic, educational, and research purposes only. All assets were recovered from the Internet Archive Wayback Machine. Copyright remains with Tencent Holdings Limited. For takedown requests, please contact: qqshow2000project@gmail.com",
      colophon:
        '(qqshow2000.com is designed and made by <a href="https://www.instagram.com/kayzeng777/" target="_blank" rel="noopener noreferrer">Kay Zeng</a> as she\'s thinking about the QQ Show items she bought with her snack money.)',
      timeline: "last updated: sep 23, 2025,  launched: sep 22, 2025",
    },
  },
};

export type TranslationKeys = typeof translations.zh;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationKeys;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>("zh");
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
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
