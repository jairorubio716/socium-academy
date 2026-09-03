'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { crearCliente } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ToggleTheme } from '@/components/ui/ToggleTheme'

export default function PaginaRegistro() {
  const router = useRouter()
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [nombreCompleto, setNombreCompleto] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
  setCargando(false)
  setError('')
  const resetearEstado = () => {
    setCargando(false)
    setError('')
  }
  window.addEventListener('focus', resetearEstado)
  return () => {
    window.removeEventListener('focus', resetearEstado)
  }
}, [])

  const manejarRegistro = async (e: React.FormEvent) => {
    e.preventDefault()
    setCargando(true)
    setError('')

    const supabase = crearCliente()
    const { error } = await supabase.auth.signUp({
      email: correo,
      password: contrasena,
      options: {
        data: { full_name: nombreCompleto }
      }
    })

    if (error) {
      setError(error.message)
    } else {
      router.push('/dashboard')
    }
    setCargando(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 md:p-8 relative">
      
      {}
      <div className="absolute top-4 right-4">
        <ToggleTheme />
      </div>

      <Card className="w-full max-w-md mx-auto shadow-2xl border-0 dark:bg-gray-800/90 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <span className="text-3xl font-bold tracking-tight text-blue-600 dark:text-blue-400">SOCIUM</span>
            <span className="text-3xl font-light text-gray-400 dark:text-gray-500 ml-1">ACADEMY</span>
          </div>
          <CardTitle className="text-2xl md:text-3xl font-bold dark:text-white">Crear cuenta</CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            Ingresa tus datos para empezar a aprender tecnología
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={manejarRegistro} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombreCompleto" className="text-sm font-medium dark:text-gray-300">
                Nombre completo
              </Label>
              <Input
                id="nombreCompleto"
                type="text"
                placeholder="Ej: Socium Academy"
                value={nombreCompleto}
                onChange={(e) => setNombreCompleto(e.target.value)}
                className="h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="correo" className="text-sm font-medium dark:text-gray-300">
                Correo electrónico
              </Label>
              <Input
                id="correo"
                type="email"
                placeholder="tu@correo.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contrasena" className="text-sm font-medium dark:text-gray-300">
                Contraseña
              </Label>
              <Input
                id="contrasena"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                className="h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-2 rounded-md text-sm">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-11 text-base font-semibold bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
              disabled={cargando}
            >
              {cargando ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Registrando...
                </span>
              ) : (
                'Registrarse'
              )}
            </Button>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
              ¿Ya tienes cuenta?{' '}
              <Link href="/auth/login" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                Inicia sesión
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}