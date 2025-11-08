import { Cat } from '@/types/cat';

export const exportToCSV = (cats: Cat[]): string => {
  const headers = [
    'id',
    'catId',
    'catName',
    'ownerFullName',
    'medical',
    'physical',
    'notes',
    'spriteUrl',
    'photoDataURL',
    'createdAt'
  ];

  const csvRows = [
    headers.join(','),
    ...cats.map(cat =>
      headers
        .map(header => {
          const value = cat[header as keyof Cat] || '';
          // Escape quotes and wrap in quotes if contains comma
          const stringValue = String(value).replace(/"/g, '""');
          return stringValue.includes(',') ? `"${stringValue}"` : stringValue;
        })
        .join(',')
    )
  ];

  return csvRows.join('\n');
};

export const downloadCSV = (csvContent: string, filename: string): void => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const parseCSV = (csvText: string): Cat[] => {
  const lines = csvText.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim());
  const cats: Cat[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const cat: any = {};

    headers.forEach((header, index) => {
      cat[header] = values[index] || '';
    });

    cats.push(cat as Cat);
  }

  return cats;
};

// Helper to parse CSV line with proper quote handling
const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
};
