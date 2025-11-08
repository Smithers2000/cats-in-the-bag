import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { addCat } from '@/lib/storage';
import { Cat } from '@/types/cat';
import { toast } from 'sonner';

export const AddCat = () => {
  const [formData, setFormData] = useState({
    catId: '',
    ownerFullName: '',
    catName: '',
    physical: '',
    medical: '',
    notes: '',
    photoUrl: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      photoUrl: '',
    });
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
          <h2 className="text-xl mb-6 text-card-foreground">Cat Photo</h2>
          
          <div>
            <Label htmlFor="photoUrl" className="text-xs mb-2 block">Photo URL (from database)</Label>
            <Input
              id="photoUrl"
              name="photoUrl"
              value={formData.photoUrl}
              onChange={handleInputChange}
              placeholder="Will be populated from database..."
              className="border-2 border-border text-sm mb-4"
            />
            
            {formData.photoUrl && (
              <div className="mt-4 p-4 bg-background rounded-lg border-2 border-border">
                <img
                  src={formData.photoUrl}
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
