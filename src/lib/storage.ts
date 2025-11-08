import { Cat } from '@/types/cat';

const STORAGE_KEY = 'retro-chibi-cats';

export const getCats = (): Cat[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading cats:', error);
    return [];
  }
};

export const saveCats = (cats: Cat[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cats));
  } catch (error) {
    console.error('Error saving cats:', error);
  }
};

export const addCat = (cat: Cat): void => {
  const cats = getCats();
  cats.push(cat);
  saveCats(cats);
};

export const deleteCat = (id: string): void => {
  const cats = getCats().filter(cat => cat.id !== id);
  saveCats(cats);
};

export const updateCat = (id: string, updatedCat: Partial<Cat>): void => {
  const cats = getCats().map(cat =>
    cat.id === id ? { ...cat, ...updatedCat } : cat
  );
  saveCats(cats);
};
