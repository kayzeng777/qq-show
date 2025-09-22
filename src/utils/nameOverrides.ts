export type NameOverrides = Record<string, string>; // key: item.id, value: name

const STORAGE_KEY = 'qqshow_name_overrides';

export function loadOverrides(): NameOverrides {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as NameOverrides) : {};
  } catch {
    return {};
  }
}

export function saveOverrides(overrides: NameOverrides): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
}

export function applyOverridesToCategories<T extends { id: string; items: { id: string; name: string }[] }>(
  categories: T[],
  overrides: NameOverrides
): T[] {
  return categories.map((cat) => ({
    ...cat,
    items: cat.items.map((it) => ({ ...it, name: overrides[it.id] ?? it.name })),
  }));
}


