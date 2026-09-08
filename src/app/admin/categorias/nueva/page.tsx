'use client'

import { crearCategoria } from '@/actions/categorias'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NuevaCategoriaPage() {
  async function handleSubmit(formData: FormData) {
    try {
      await crearCategoria(formData)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/categorias">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Volver
          </Button>
        </Link>
        <h1 className="text-2xl font-heading font-bold text-foreground">Nueva categoría</h1>
      </div>

      <Card className="bg-card dark:bg-card border-border max-w-2xl">
        <CardHeader>
          <CardTitle className="text-lg">Crear categoría</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                name="nombre"
                placeholder="Ej: Programación"
                required
              />
            </div>
            <div>
              <Label htmlFor="slug">Slug (URL amigable)</Label>
              <Input
                id="slug"
                name="slug"
                placeholder="Ej: programacion"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                El slug se usa en la URL. Solo letras minúsculas y guiones.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit">Guardar categoría</Button>
              <Link href="/admin/categorias">
                <Button variant="outline" type="button">Cancelar</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}