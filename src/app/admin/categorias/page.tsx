import { obtenerCategorias } from '@/actions/categorias'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { eliminarCategoria } from '@/actions/categorias'

export default async function CategoriasPage() {
  const categorias = await obtenerCategorias()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-heading font-bold text-foreground">Categorías</h1>
        <Link href="/admin/categorias/nueva">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nueva categoría
          </Button>
        </Link>
      </div>

      {categorias.length === 0 ? (
        <Card className="bg-card dark:bg-card border-border">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">No hay categorías creadas aún.</p>
            <Link href="/admin/categorias/nueva">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Crear primera categoría
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categorias.map((categoria) => (
            <Card key={categoria.id} className="bg-card dark:bg-card border-border hover:shadow-card-hover transition-all duration-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-foreground">{categoria.nombre}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Slug: <span className="font-mono">{categoria.slug}</span>
                </p>
                <div className="flex gap-2">
                  <Link href={`/admin/categorias/${categoria.id}/editar`}>
                    <Button variant="outline" size="sm">
                      <Pencil className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                  </Link>
                  <form action={eliminarCategoria.bind(null, categoria.id)}>
                    <Button variant="destructive" size="sm" type="submit">
                      <Trash2 className="w-4 h-4 mr-1" />
                      Eliminar
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}