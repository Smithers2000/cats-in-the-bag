import fetch from 'node-fetch';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://tje3xq7eu2.execute-api.us-west-1.amazonaws.com/production/search';
const LOCATIONS = [
  'El Cajon Campus',
  'Escondido Campus',
  'Oceanside Campus - Cats%2FSmall Animals',
  'Oceanside Campus - Dogs',
  'San Diego Campus - 5500',
  'San Diego Campus - 5485',
  'San Diego Campus - Behavior Center',
  'San Diego Campus - 5480',
  'Nursery - San Diego',
  'San Diego Campus - 5495',
  'San Diego Campus - 5525'
];

const IMAGE_DIR = './cats';
if (!fs.existsSync(IMAGE_DIR)) fs.mkdirSync(IMAGE_DIR);

// Fetch all cats/kittens from the API
async function fetchAnimals() {
  const params = new URLSearchParams();
  params.append('AnimalType', 'ALL');
  params.append('StatusCategory', 'available');
  LOCATIONS.forEach(loc => params.append('Location', loc));

  const url = `${BASE_URL}?${params.toString()}`;

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0',
      'Accept': 'application/json',
      'Origin': 'https://sdhumane.org',
      'Referer': 'https://sdhumane.org/adopt/available-pets/'
    }
  });

  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const data = await res.json();
  const animals = data.response || [];

  // Filter cats/kittens
  return animals.filter(pet =>
    pet.AnimalType.toLowerCase().includes('cat') || pet.AnimalType.toLowerCase().includes('kitten')
  );
}

// Get photo URL from API data
function getPhotoUrl(pet) {
  if (!pet.MainPhoto || !pet.MainPhoto.default || pet.MainPhoto.default.length === 0) return null;
  return pet.MainPhoto.default[0]; // relative path from API
}

// Download image using Puppeteer
async function downloadImageWithPuppeteer(url, filepath, browser) {
  try {
    const page = await browser.newPage();
    const res = await page.goto(url, { timeout: 30000, waitUntil: 'networkidle2' });
    const buffer = await res.buffer();
    fs.writeFileSync(filepath, buffer);
    await page.close();
    return true;
  } catch (err) {
    console.warn(`Failed to download ${url}: ${err}`);
    return false;
  }
}

(async () => {
  try {
    const cats = await fetchAnimals();
    console.log(`Found ${cats.length} cats/kittens.`);

    const browser = await puppeteer.launch({ headless: true });
    const csvHeader = `"AnimalId","Name","Type","Breed","Age","Gender","Location","Status","Photo"\n`;
    const csvRows = [];

    for (const cat of cats) {
      const ageStr = `${cat.Age.Years}y ${cat.Age.Months}m ${cat.Age.Weeks}w`;
      let localPhoto = '';

      const photoUrl = getPhotoUrl(cat);
      if (photoUrl) {
        // Build absolute URL for Puppeteer
        const absUrl = photoUrl.startsWith('/storage')
          ? 'https://do31x39459kz9.cloudfront.net' + photoUrl
          : photoUrl;

        // Generate local filename
        const extMatch = absUrl.match(/\.(jpg|jpeg|png)$/i);
        const ext = extMatch ? extMatch[0] : '.jpeg';
        const filename = `${cat.AnimalId}${ext}`;
        const filepath = path.join(IMAGE_DIR, filename);

        const success = await downloadImageWithPuppeteer(absUrl, filepath, browser);
        if (success) localPhoto = filepath;
      }

      csvRows.push(`"${cat.AnimalId}","${cat.Name}","${cat.AnimalType}","${cat.Breed.Primary}","${ageStr}","${cat.Sex}","${cat.Location}","${cat.Status}","${localPhoto}"`);
    }

    fs.writeFileSync('cats.csv', csvHeader + csvRows.join('\n'));
    console.log(`Saved cats.csv with images downloaded to ${IMAGE_DIR}/`);

    await browser.close();
  } catch (err) {
    console.error('Error:', err);
  }
})();
