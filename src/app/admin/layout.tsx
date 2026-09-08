import { crearClienteServidor } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ToggleTheme } from '@/components/ui/ToggleTheme'
import {
  LayoutDashboard,
  FolderTree,
  BookOpen,
  Users,
  FileText,
  LogOut,
} from 'lucide-react'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await crearClienteServidor()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('rol')
    .eq('id', user.id)
    .single()

  if (perfil?.rol !== 'ADMIN') {
    redirect('/dashboard')
  }

  const menuItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/categorias', label: 'Categorías', icon: FolderTree },
    { href: '/admin/cursos', label: 'Cursos', icon: BookOpen },
    { href: '/admin/usuarios', label: 'Usuarios', icon: Users },
    { href: '/admin/certificados', label: 'Certificados', icon: FileText },
  ]

  return (
    <div className="min-h-screen bg-section dark:bg-background-dark flex">
      
      <aside className="hidden md:flex flex-col w-64 bg-card dark:bg-card border-r border-border h-screen sticky top-0">
        <div className="p-4 border-b border-border">
          <h1 className="text-xl font-heading font-bold text-foreground">SOCIUM ADMIN</h1>
          <p className="text-xs text-muted-foreground">Panel de administración</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-border space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-sm text-muted-foreground">Tema</span>
            <ToggleTheme />
          </div>
          <form action="/auth/logout" method="POST">
            <Button 
              variant="outline" 
              className="w-full justify-start text-muted-foreground"
              type="submit"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar sesión
            </Button>
          </form>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card dark:bg-card">
          <h1 className="text-lg font-heading font-bold text-foreground">SOCIUM ADMIN</h1>
          <div className="flex items-center gap-2">
            <ToggleTheme />
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}