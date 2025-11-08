export interface Cat {
  id: string;
  catId: string;
  catName: string;
  ownerFullName: string;
  physical: string;
  medical: string;
  notes: string;
  photoUrl?: string;
  createdAt: string;
}

export interface CatFormData extends Omit<Cat, 'id' | 'createdAt'> {}
