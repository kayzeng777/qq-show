import React, { useState } from "react";
import BackgroundManager from "../components/BackgroundManager";
import type { BackgroundItem } from "../utils/backgroundManager";
import { categories } from "../data/categories";
import {
  loadOverrides,
  saveOverrides,
  applyOverridesToCategories,
} from "../utils/nameOverrides";

// 将任意分类映射到通用管理项
const mapCategoryToItems = (catId: string): BackgroundItem[] => {
  const cat = (categories as unknown as any[]).find((c) => c.id === catId);
  if (!cat) return [];
  return cat.items.map((it: any) => ({
    id: it.id,
    name: it.name,
    filename: it.image.replace("/assets/", ""),
  }));
};

const initialBackgrounds: BackgroundItem[] = mapCategoryToItems("backgrounds");

const BackgroundManagement: React.FC = () => {
  const [activeCatId, setActiveCatId] = useState<string>("backgrounds");
  const [overrides, setOverrides] = useState(loadOverrides());
  const withOverrides = applyOverridesToCategories(
    categories as any,
    overrides,
  );
  const [backgrounds, setBackgrounds] =
    useState<BackgroundItem[]>(initialBackgrounds);

  const handleRename = (id: string, newName: string) => {
    const next = { ...overrides, [id]: newName };
    setOverrides(next);
    saveOverrides(next);
    setBackgrounds((prev) =>
      prev.map((bg) => (bg.id === id ? { ...bg, name: newName } : bg)),
    );
  };

  const handleRemove = (_id: string) => {};

  const handleCatChange = (catId: string) => {
    setActiveCatId(catId);
    const cat = (withOverrides as any[]).find((c) => c.id === catId);
    const mapped: BackgroundItem[] = (cat?.items ?? []).map((it: any) => ({
      id: it.id,
      name: it.name,
      filename: it.image.replace("/assets/", ""),
    }));
    setBackgrounds(mapped);
  };

  return (
    <div className="background-management-page">
      <div
        style={{ marginBottom: 12, display: "flex", gap: 8, flexWrap: "wrap" }}
      >
        {(withOverrides as any[]).map((c) => (
          <button
            key={c.id}
            className={`tab-button ${activeCatId === c.id ? "active" : ""}`}
            onClick={() => handleCatChange(c.id)}
          >
            {c.name}
          </button>
        ))}
      </div>
      <BackgroundManager
        title="素材管理"
        backgrounds={backgrounds}
        onRename={handleRename}
        onRemove={handleRemove}
      />
    </div>
  );
};

export default BackgroundManagement;
