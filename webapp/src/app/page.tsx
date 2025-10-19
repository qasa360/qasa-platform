'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Building, Search } from 'lucide-react';

/**
 * Home page - Floors summary with search functionality
 */
export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - will be replaced with real data from backend
  const mockFloors = [
    { id: 1, name: 'Piso 1', building: 'Edificio A', status: 'activo' },
    { id: 2, name: 'Piso 2', building: 'Edificio A', status: 'activo' },
    { id: 3, name: 'Piso 3', building: 'Edificio B', status: 'activo' },
  ];

  const filteredFloors = mockFloors.filter((floor) =>
    floor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pisos</h1>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar pisos por nombre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Floors List */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredFloors.length > 0 ? (
            filteredFloors.map((floor) => (
              <Card
                key={floor.id}
                className="transition-shadow hover:shadow-lg"
              >
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-primary" />
                    <CardTitle>{floor.name}</CardTitle>
                  </div>
                  <CardDescription>{floor.building}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Estado:{' '}
                    <span className="font-medium text-green-600">
                      {floor.status}
                    </span>
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="col-span-full">
              <CardHeader>
                <CardTitle>No se encontraron pisos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {searchQuery
                    ? 'No hay pisos que coincidan con tu búsqueda. Intenta con otro término.'
                    : 'No se han configurado pisos aún.'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
