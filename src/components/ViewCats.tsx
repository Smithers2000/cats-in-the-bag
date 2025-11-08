import { useState, useEffect } from 'react';
import { getCats, saveCats } from '@/lib/storage';
import { Cat } from '@/types/cat';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CatCard } from './CatCard';
import { exportToCSV, downloadCSV, parseCSV } from '@/lib/csv';
import { toast } from 'sonner';
import { Search, Download, Upload, FileUp } from 'lucide-react';

export const ViewCats = () => {
  const [cats, setCats] = useState<Cat[]>([]);
  const [filteredCats, setFilteredCats] = useState<Cat[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('createdAt-desc');

  useEffect(() => {
    loadCats();
  }, []);

  useEffect(() => {
    filterAndSortCats();
  }, [cats, searchQuery, sortBy]);

  const loadCats = () => {
    const loadedCats = getCats();
    setCats(loadedCats);
  };

  const filterAndSortCats = () => {
    let result = [...cats];

    // Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        cat =>
          cat.catName.toLowerCase().includes(query) ||
          cat.physical.toLowerCase().includes(query) ||
          cat.medical.toLowerCase().includes(query)
      );
    }

    // Sort
    const [field, order] = sortBy.split('-');
    result.sort((a, b) => {
      const aVal = a[field as keyof Cat];
      const bVal = b[field as keyof Cat];
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return order === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return 0;
    });

    setFilteredCats(result);
  };

  const handleExportCSV = () => {
    const csv = exportToCSV(cats);
    downloadCSV(csv, `cats-export-${new Date().toISOString().split('T')[0]}.csv`);
    toast.success('CSV exported successfully!');
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csvText = event.target?.result as string;
        const importedCats = parseCSV(csvText);
        
        if (importedCats.length === 0) {
          toast.error('No valid cats found in CSV');
          return;
        }

        saveCats(importedCats);
        loadCats();
        toast.success(`Imported ${importedCats.length} cats successfully!`);
      } catch (error) {
        toast.error('Error importing CSV');
        console.error(error);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleImportShelterCats = async () => {
    try {
      toast.info('Fetching shelter cats...');
      const response = await fetch('https://tje3xq7eu2.execute-api.us-west-1.amazonaws.com/production/search');
      const data = await response.json();
      
      // Transform shelter API data to our Cat format
      const shelterCats: Cat[] = data.animals?.map((animal: any) => ({
        id: `shelter-${animal.id || Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        catId: `SHELTER-${animal.id || 'UNKNOWN'}`,
        catName: animal.name || 'Unknown',
        ownerFullName: animal.organization || 'Shelter',
        physical: animal.description || '',
        medical: animal.health || '',
        notes: `Breed: ${animal.breed || 'Unknown'}, Age: ${animal.age || 'Unknown'}`,
        spriteUrl: '', // Will use default
        photoDataURL: animal.photos?.[0]?.medium || '',
        createdAt: new Date().toISOString(),
      })) || [];

      if (shelterCats.length > 0) {
        const existingCats = getCats();
        saveCats([...existingCats, ...shelterCats]);
        loadCats();
        toast.success(`Imported ${shelterCats.length} shelter cats!`);
      } else {
        toast.info('No cats found from shelter API');
      }
    } catch (error) {
      toast.error('Error fetching shelter cats');
      console.error(error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-card p-6 rounded-lg border-4 border-border retro-shadow mb-6">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
            <Input
              placeholder="Search by name, physical, or medical..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-2 border-border text-sm"
            />
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="border-2 border-border text-sm">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="catName-asc">Name (A-Z)</SelectItem>
              <SelectItem value="catName-desc">Name (Z-A)</SelectItem>
              <SelectItem value="ownerFullName-asc">Owner (A-Z)</SelectItem>
              <SelectItem value="ownerFullName-desc">Owner (Z-A)</SelectItem>
              <SelectItem value="createdAt-desc">Newest First</SelectItem>
              <SelectItem value="createdAt-asc">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={handleExportCSV}
            variant="secondary"
            className="text-xs px-4 py-5 border-4 border-border retro-shadow-hover"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>

          <label className="cursor-pointer">
            <input
              type="file"
              accept=".csv"
              onChange={handleImportCSV}
              className="hidden"
            />
            <Button
              type="button"
              variant="secondary"
              className="text-xs px-4 py-5 border-4 border-border retro-shadow-hover"
              asChild
            >
              <span>
                <Upload className="w-4 h-4 mr-2" />
                Import CSV
              </span>
            </Button>
          </label>

          <Button
            onClick={handleImportShelterCats}
            variant="secondary"
            className="text-xs px-4 py-5 border-4 border-border retro-shadow-hover"
          >
            <FileUp className="w-4 h-4 mr-2" />
            Import Shelter Cats
          </Button>
        </div>
      </div>

      {filteredCats.length === 0 ? (
        <div className="bg-card p-12 rounded-lg border-4 border-border retro-shadow text-center">
          <p className="text-muted-foreground text-sm">
            {searchQuery ? 'No cats match your search' : 'No cats added yet'}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCats.map((cat) => (
            <CatCard key={cat.id} cat={cat} onUpdate={loadCats} />
          ))}
        </div>
      )}
    </div>
  );
};
