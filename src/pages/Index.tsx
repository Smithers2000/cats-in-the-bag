import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AddCat } from '@/components/AddCat';
import { ViewCats } from '@/components/ViewCats';
import { Statistics } from '@/components/Statistics';
import { Cat as CatIcon, List, BarChart3 } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen retro-gradient py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl mb-4 text-foreground">
            Retro Chibi Cat Tracker
          </h1>
          <p className="text-sm text-muted-foreground">
            A nostalgic cat management system for shelters 🐱
          </p>
        </header>

        <Tabs defaultValue="add" className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-8 bg-card border-4 border-border retro-shadow h-auto">
            <TabsTrigger 
              value="add" 
              className="py-4 text-xs md:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <CatIcon className="w-4 h-4 mr-2" />
              Add Cat
            </TabsTrigger>
            <TabsTrigger 
              value="view" 
              className="py-4 text-xs md:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <List className="w-4 h-4 mr-2" />
              View Cats
            </TabsTrigger>
            <TabsTrigger 
              value="stats" 
              className="py-4 text-xs md:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Statistics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="add" className="mt-6">
            <AddCat />
          </TabsContent>

          <TabsContent value="view" className="mt-6">
            <ViewCats />
          </TabsContent>

          <TabsContent value="stats" className="mt-6">
            <Statistics />
          </TabsContent>
        </Tabs>

        <footer className="mt-12 text-center text-xs text-muted-foreground border-t-4 border-border pt-6">
          <p>Built with ♥ — Retro Chibi Theme • Prototype</p>
          <p className="mt-2">© {new Date().getFullYear()} Cat Tracker System</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
