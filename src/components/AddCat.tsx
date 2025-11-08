import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { addCat } from '@/lib/storage';
import { Cat } from '@/types/cat';
import { toast } from 'sonner';
import chibiCat1 from '@/assets/chibi-cat-1.png';
import chibiCat2 from '@/assets/chibi-cat-2.png';
import chibiCat3 from '@/assets/chibi-cat-3.png';
import chibiCat4 from '@/assets/chibi-cat-4.png';

const defaultSprites = [chibiCat1, chibiCat2, chibiCat3, chibiCat4];

export const AddCat = () => {
  const [formData, setFormData] = useState({
    catId: '',
    ownerFullName: '',
    catName: '',
    physical: '',
    medical: '',
    notes: '',
    spriteUrl: defaultSprites[0],
    photoDataURL: '',
  });

  const [customSprite, setCustomSprite] = useState<string>('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSpriteSelect = (sprite: string) => {
    setFormData({ ...formData, spriteUrl: sprite });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photoDataURL: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCustomSpriteUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setCustomSprite(dataUrl);
        setFormData({ ...formData, spriteUrl: dataUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.catId || !formData.catName || !formData.ownerFullName) {
      toast.error('Please fill in required fields');
      return;
    }

    const newCat: Cat = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...formData,
      createdAt: new Date().toISOString(),
    };

    addCat(newCat);
    toast.success('Cat added successfully!');
    handleClear();
  };

  const handleClear = () => {
    setFormData({
      catId: '',
      ownerFullName: '',
      catName: '',
      physical: '',
      medical: '',
      notes: '',
      spriteUrl: defaultSprites[0],
      photoDataURL: '',
    });
    setCustomSprite('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card p-6 rounded-lg border-4 border-border retro-shadow">
          <h2 className="text-xl mb-6 text-card-foreground">Basic Info</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="catId" className="text-xs mb-2 block">Cat ID *</Label>
              <Input
                id="catId"
                name="catId"
                value={formData.catId}
                onChange={handleInputChange}
                placeholder="CAT001"
                required
                className="border-2 border-border text-sm"
              />
            </div>
            
            <div>
              <Label htmlFor="catName" className="text-xs mb-2 block">Cat Name *</Label>
              <Input
                id="catName"
                name="catName"
                value={formData.catName}
                onChange={handleInputChange}
                placeholder="Whiskers"
                required
                className="border-2 border-border text-sm"
              />
            </div>
          </div>

          <div className="mt-4">
            <Label htmlFor="ownerFullName" className="text-xs mb-2 block">Owner Full Name *</Label>
            <Input
              id="ownerFullName"
              name="ownerFullName"
              value={formData.ownerFullName}
              onChange={handleInputChange}
              placeholder="John Doe"
              required
              className="border-2 border-border text-sm"
            />
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border-4 border-border retro-shadow">
          <h2 className="text-xl mb-6 text-card-foreground">Description</h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="physical" className="text-xs mb-2 block">Physical Description</Label>
              <Textarea
                id="physical"
                name="physical"
                value={formData.physical}
                onChange={handleInputChange}
                placeholder="Orange tabby, medium size..."
                className="border-2 border-border text-sm min-h-24"
              />
            </div>

            <div>
              <Label htmlFor="medical" className="text-xs mb-2 block">Medical Info</Label>
              <Textarea
                id="medical"
                name="medical"
                value={formData.medical}
                onChange={handleInputChange}
                placeholder="Vaccinated, neutered..."
                className="border-2 border-border text-sm min-h-24"
              />
            </div>

            <div>
              <Label htmlFor="notes" className="text-xs mb-2 block">Additional Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Friendly, loves treats..."
                className="border-2 border-border text-sm min-h-24"
              />
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border-4 border-border retro-shadow">
          <h2 className="text-xl mb-6 text-card-foreground">Sprite Picker</h2>
          
          <div className="grid grid-cols-4 gap-4 mb-4">
            {defaultSprites.map((sprite, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSpriteSelect(sprite)}
                className={`p-2 rounded-lg border-4 transition-all retro-shadow-hover ${
                  formData.spriteUrl === sprite
                    ? 'border-primary bg-primary/20'
                    : 'border-border bg-background'
                }`}
              >
                <img src={sprite} alt={`Sprite ${index + 1}`} className="w-full" />
              </button>
            ))}
          </div>

          {customSprite && (
            <div className="mb-4">
              <button
                type="button"
                onClick={() => handleSpriteSelect(customSprite)}
                className={`p-2 rounded-lg border-4 transition-all retro-shadow-hover ${
                  formData.spriteUrl === customSprite
                    ? 'border-primary bg-primary/20'
                    : 'border-border bg-background'
                }`}
              >
                <img src={customSprite} alt="Custom sprite" className="w-24 mx-auto" />
              </button>
            </div>
          )}

          <div>
            <Label htmlFor="customSprite" className="text-xs mb-2 block">Upload Custom Sprite</Label>
            <Input
              id="customSprite"
              type="file"
              accept="image/*"
              onChange={handleCustomSpriteUpload}
              className="border-2 border-border text-xs"
            />
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border-4 border-border retro-shadow">
          <h2 className="text-xl mb-6 text-card-foreground">Photo Upload</h2>
          
          <div>
            <Label htmlFor="photo" className="text-xs mb-2 block">Cat Photo</Label>
            <Input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="border-2 border-border text-xs mb-4"
            />
            
            {formData.photoDataURL && (
              <div className="mt-4 p-4 bg-background rounded-lg border-2 border-border">
                <img
                  src={formData.photoDataURL}
                  alt="Cat preview"
                  className="max-w-xs mx-auto rounded-lg"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Button
            type="submit"
            className="px-8 py-6 text-sm border-4 border-border retro-shadow-hover"
          >
            Save Cat
          </Button>
          
          <Button
            type="button"
            onClick={handleClear}
            variant="secondary"
            className="px-8 py-6 text-sm border-4 border-border retro-shadow-hover"
          >
            Clear Form
          </Button>
        </div>
      </form>
    </div>
  );
};
