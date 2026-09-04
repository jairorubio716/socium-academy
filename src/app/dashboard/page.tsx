'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { crearCliente } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ToggleTheme } from '@/components/ui/ToggleTheme'
import {
  BookOpen,
  CheckCircle,
  Award,
  Trophy,
  User,
  LogOut,
  Rocket,
  ArrowRight,
  GraduationCap
} from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const [usuario, setUsuario] = useState<any>(null)
  const [perfil, setPerfil] = useState<any>(null)
  const [cargando, setCargando] = useState(true)
  const [estadisticas, setEstadisticas] = useState({
    cursosActivos: 0,
    cursosCompletados: 0,
    xpTotal: 0,
    nivel: 1
  })
  const [cursosInscritos, setCursosInscritos] = useState<any[]>([])

  useEffect(() => {
    const supabase = crearCliente()
    
    async function obtenerDatos() {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
          router.push('/auth/login')
          return
        }

        const { data: perfilData, error: perfilError } = await supabase
          .from('perfiles')
          .select('nombre_completo, rol')
          .eq('id', user.id)
          .single()

        if (perfilError) {
          console.error('Error al obtener perfil:', perfilError)
        }

        const { data: inscripciones, error: inscripcionesError } = await supabase
          .from('inscripciones')
          .select(`
            estado,
            progreso,
            curso_id,
            cursos (
              id,
              titulo,
              slug,
              nivel,
              categoria_id,
              categorias (nombre)
            )
          `)
          .eq('usuario_id', user.id)

        if (!inscripcionesError && inscripciones) {
          const activos = inscripciones.filter(i => i.estado === 'ACTIVO').length
          const completados = inscripciones.filter(i => i.estado === 'COMPLETADO').length
          
          setEstadisticas(prev => ({
            ...prev,
            cursosActivos: activos,
            cursosCompletados: completados
          }))

          setCursosInscritos(inscripciones)
        }

        const { data: xpData, error: xpError } = await supabase
          .from('transacciones_xp')
          .select('cantidad_xp')
          .eq('usuario_id', user.id)

        if (!xpError && xpData) {
          const xpTotal = xpData.reduce((sum, item) => sum + item.cantidad_xp, 0)
          const nivel = Math.floor(xpTotal / 100) + 1
          
          setEstadisticas(prev => ({
            ...prev,
            xpTotal: xpTotal,
            nivel: nivel
          }))
        }

        setUsuario(user)
        setPerfil(perfilData)
      } catch (error) {
        console.error('Error al cargar dashboard:', error)
      } finally {
        setCargando(false)
      }
    }

    obtenerDatos()
  }, [router])

  const manejarCerrarSesion = async () => {
    const supabase = crearCliente()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando tu dashboard...</p>
        </div>
      </div>
    )
  }

  if (!usuario) {
    return null
  }

  const nombreUsuario = perfil?.nombre_completo || usuario.email?.split('@')[0] || 'Usuario'

  return (
    <div className="min-h-screen bg-section dark:bg-background-dark p-4 md:p-8">
      
      <div className="max-w-6xl mx-auto">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground tracking-tight">
              ¡Bienvenido, {nombreUsuario}!
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <GraduationCap className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {perfil?.rol === 'ADMIN' && 'Administrador'}
                {perfil?.rol === 'INSTRUCTOR' && 'Instructor'}
                {perfil?.rol === 'ESTUDIANTE' && 'Estudiante'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <ToggleTheme />
            <Button 
              variant="outline" 
              className="flex-1 sm:flex-none border-border dark:border-border"
              onClick={() => router.push('/cursos')}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Explorar cursos
            </Button>
            <Button 
              variant="destructive"
              className="flex-1 sm:flex-none"
              onClick={manejarCerrarSesion}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar sesión
            </Button>
          </div>
        </div>

        <Card className="mb-8 shadow-card bg-card dark:bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-foreground">
              <User className="w-5 h-5 text-primary" />
              Tu perfil
            </CardTitle>
            <CardDescription className="text-muted-foreground text-base">
              {usuario.email}
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-card bg-card dark:bg-card border-border hover:shadow-card-hover transition-all duration-200">
            <CardContent className="p-4 text-center">
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="text-3xl font-bold text-foreground">{estadisticas.cursosActivos}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">En progreso</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-card bg-card dark:bg-card border-border hover:shadow-card-hover transition-all duration-200">
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600 dark:text-green-400" />
              <p className="text-3xl font-bold text-foreground">{estadisticas.cursosCompletados}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Completados</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-card bg-card dark:bg-card border-border hover:shadow-card-hover transition-all duration-200">
            <CardContent className="p-4 text-center">
              <Award className="w-8 h-8 mx-auto mb-2 text-yellow-600 dark:text-yellow-400" />
              <p className="text-3xl font-bold text-foreground">{estadisticas.xpTotal}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">XP total</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-card bg-card dark:bg-card border-border hover:shadow-card-hover transition-all duration-200">
            <CardContent className="p-4 text-center">
              <Trophy className="w-8 h-8 mx-auto mb-2 text-purple-600 dark:text-purple-400" />
              <p className="text-3xl font-bold text-foreground">{estadisticas.nivel}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Nivel</p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-heading font-bold text-foreground mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Tus cursos
          </h2>
          {cursosInscritos.length === 0 ? (
            <Card className="shadow-card bg-card dark:bg-card border-border">
              <CardContent className="p-8 text-center">
                <div className="text-5xl mb-4">📖</div>
                <p className="text-muted-foreground text-lg mb-4">Aún no estás inscrito en ningún curso.</p>
                <Button onClick={() => router.push('/cursos')} variant="default" size="lg">
                  <Rocket className="w-4 h-4 mr-2" />
                  Explorar cursos
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cursosInscritos.map((inscripcion) => (
                <Card key={inscripcion.id} className="shadow-card bg-card dark:bg-card border-border hover:shadow-card-hover transition-all duration-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-foreground flex justify-between items-start">
                      <span className="font-heading">{inscripcion.cursos.titulo}</span>
                      <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-1 rounded-full">
                        {inscripcion.estado === 'ACTIVO' ? 'En progreso' : 'Completado'}
                      </span>
                    </CardTitle>
                    <CardDescription className="text-muted-foreground text-sm">
                      {inscripcion.cursos.categorias?.nombre || 'Sin categoría'} • {inscripcion.cursos.nivel}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm text-muted-foreground mb-1">
                          <span>Progreso</span>
                          <span>{inscripcion.progreso || 0}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div 
                            className="bg-primary rounded-full h-2.5 transition-all duration-500" 
                            style={{ width: `${inscripcion.progreso || 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10" onClick={() => router.push(`/cursos/${inscripcion.cursos.slug}`)}>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <Card className="shadow-card bg-card dark:bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-foreground">
              <Rocket className="w-5 h-5 text-primary" />
              Próximos pasos
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Estamos construyendo tu experiencia de aprendizaje
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <BookOpen className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Explorador de cursos</p>
                <p className="text-xs text-muted-foreground">Encuentra tu próximo curso</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <div>
                <p className="text-sm font-medium text-foreground">Logros e insignias</p>
                <p className="text-xs text-muted-foreground">Sigue tu progreso</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-sm font-medium text-foreground">Certificados</p>
                <p className="text-xs text-muted-foreground">Tus certificaciones</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}