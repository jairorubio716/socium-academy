'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { crearCliente } from '@/lib/supabase/client'
import { editarCategoria } from '@/actions/categorias'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft } from 'lucide-react'

// ⚠️ En Next.js 15+, `params` es una Promesa. Debemos usar `await` para obtener sus propiedades.
export default function EditarCategoriaPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [categoria, setCategoria] = useState<any>(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function obtenerCategoria() {
      // 🔥 Desenvolver la promesa `params` para obtener el `id`
      const { id } = await params
      const supabase = crearCliente()

      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .eq('id', parseInt(id))
        .single()

      if (error) {
        console.error(error)
        router.push('/admin/categorias')
        return
      }

      setCategoria(data)
      setCargando(false)
    }

    obtenerCategoria()
  }, [params, router])

  async function handleSubmit(formData: FormData) {
    try {
      const { id } = await params
      await editarCategoria(parseInt(id), formData)
    } catch (error: any) {
      setError(error.message)
    }
  }

  if (cargando) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!categoria) {
    return <p className="text-muted-foreground">Categoría no encontrada</p>
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
        <h1 className="text-2xl font-heading font-bold text-foreground">Editar categoría</h1>
      </div>

      <Card className="bg-card dark:bg-card border-border max-w-2xl">
        <CardHeader>
          <CardTitle className="text-lg">{categoria.nombre}</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                name="nombre"
                defaultValue={categoria.nombre}
                required
              />
            </div>
            <div>
              <Label htmlFor="slug">Slug (URL amigable)</Label>
              <Input
                id="slug"
                name="slug"
                defaultValue={categoria.slug}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                El slug se usa en la URL. Solo letras minúsculas y guiones.
              </p>
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <div className="flex gap-3 pt-2">
              <Button type="submit">Guardar cambios</Button>
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