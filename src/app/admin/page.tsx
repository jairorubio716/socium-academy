import { crearClienteServidor } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FolderTree, BookOpen, Users, FileText } from 'lucide-react'

export default async function AdminDashboardPage() {
  const supabase = await crearClienteServidor()

  // Contar categorías
  const { count: totalCategorias } = await supabase
    .from('categorias')
    .select('*', { count: 'exact', head: true })

  // Contar cursos
  const { count: totalCursos } = await supabase
    .from('cursos')
    .select('*', { count: 'exact', head: true })

  // Contar usuarios
  const { count: totalUsuarios } = await supabase
    .from('perfiles')
    .select('*', { count: 'exact', head: true })

  // Contar certificados
  const { count: totalCertificados } = await supabase
    .from('certificados')
    .select('*', { count: 'exact', head: true })

  const stats = [
    {
      titulo: 'Categorías',
      valor: totalCategorias || 0,
      icono: FolderTree,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      titulo: 'Cursos',
      valor: totalCursos || 0,
      icono: BookOpen,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      titulo: 'Usuarios',
      valor: totalUsuarios || 0,
      icono: Users,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-100 dark:bg-purple-900/30',
    },
    {
      titulo: 'Certificados',
      valor: totalCertificados || 0,
      icono: FileText,
      color: 'text-yellow-600 dark:text-yellow-400',
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    },
  ]

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-foreground mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icono
          return (
            <Card key={stat.titulo} className="bg-card dark:bg-card border-border">
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`p-3 rounded-full ${stat.bg}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.titulo}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.valor}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="mt-8">
        <Card className="bg-card dark:bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Bienvenido al panel de administración</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>Desde aquí puedes gestionar todos los contenidos de SOCIUM ACADEMY.</p>
            <ul className="mt-2 space-y-1 list-disc list-inside text-sm">
              <li><span className="font-medium text-foreground">Categorías:</span> Crea y organiza los cursos por categorías.</li>
              <li><span className="font-medium text-foreground">Cursos:</span> Administra los cursos, módulos y lecciones.</li>
              <li><span className="font-medium text-foreground">Usuarios:</span> Gestiona los perfiles y roles de los usuarios.</li>
              <li><span className="font-medium text-foreground">Certificados:</span> Revisa los certificados generados.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}