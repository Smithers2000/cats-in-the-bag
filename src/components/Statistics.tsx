import { useState, useEffect } from 'react';
import { getCats } from '@/lib/storage';
import { Cat } from '@/types/cat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PawPrint, Image, Users } from 'lucide-react';

export const Statistics = () => {
  const [stats, setStats] = useState({
    totalCats: 0,
    catsWithPhotos: 0,
    uniqueOwners: 0,
  });

  useEffect(() => {
    const cats = getCats();
    
    const uniqueOwners = new Set(cats.map(cat => cat.ownerFullName.toLowerCase()));
    const catsWithPhotos = cats.filter(cat => cat.photoDataURL).length;

    setStats({
      totalCats: cats.length,
      catsWithPhotos,
      uniqueOwners: uniqueOwners.size,
    });
  }, []);

  const statCards = [
    {
      title: 'Total Cats',
      value: stats.totalCats,
      icon: PawPrint,
      color: 'bg-retro-pink',
    },
    {
      title: 'Cats with Photos',
      value: stats.catsWithPhotos,
      icon: Image,
      color: 'bg-retro-blue',
    },
    {
      title: 'Unique Owners',
      value: stats.uniqueOwners,
      icon: Users,
      color: 'bg-retro-cream',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl mb-6 text-center">Statistics Dashboard</h2>
      
      <div className="grid md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <Card
            key={index}
            className="border-4 border-border retro-shadow overflow-hidden"
          >
            <CardHeader className={`${stat.color} p-4`}>
              <CardTitle className="flex items-center gap-2 text-sm">
                <stat.icon className="w-5 h-5" />
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-center">
              <div className="text-5xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 bg-card p-6 rounded-lg border-4 border-border retro-shadow">
        <h3 className="text-lg mb-4">Quick Facts</h3>
        <div className="space-y-2 text-sm">
          <p>
            📊 Average cats per owner:{' '}
            <span className="font-bold">
              {stats.uniqueOwners > 0
                ? (stats.totalCats / stats.uniqueOwners).toFixed(1)
                : '0'}
            </span>
          </p>
          <p>
            📸 Photo coverage:{' '}
            <span className="font-bold">
              {stats.totalCats > 0
                ? ((stats.catsWithPhotos / stats.totalCats) * 100).toFixed(0)
                : '0'}
              %
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
