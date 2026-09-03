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

export default function PaginaLogin() {
  const router = useRouter()
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
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
  const manejarLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setCargando(true)
    setError('')

    const supabase = crearCliente()
    const { error } = await supabase.auth.signInWithPassword({
      email: correo,
      password: contrasena
    })

    if (error) {
      setError(error.message)
      setCargando(false)
    } else {
      router.push('/dashboard')
    }
  }

  const manejarLoginGoogle = async () => {
    setCargando(true)
    setError('')
    const supabase = crearCliente()

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000/auth/callback'
      }
    })

    if (error) {
      setError(error.message)
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 md:p-8 relative">
      
      <div className="absolute top-4 right-4">
        <ToggleTheme />
      </div>

      <Card className="w-full max-w-md mx-auto shadow-2xl border-0 dark:bg-gray-800/90 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <span className="text-3xl font-bold tracking-tight text-blue-600 dark:text-blue-400">SOCIUM</span>
            <span className="text-3xl font-light text-gray-400 dark:text-gray-500 ml-1">ACADEMY</span>
          </div>
          <CardTitle className="text-2xl md:text-3xl font-bold dark:text-white">Iniciar sesión</CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            Accede a tu cuenta para seguir aprendiendo
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={manejarLogin} className="space-y-4">
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
                placeholder="Tu contraseña"
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
                  Iniciando...
                </span>
              ) : (
                'Iniciar sesión'
              )}
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  O continúa con
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full h-11 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
              onClick={manejarLoginGoogle}
              disabled={cargando}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continuar con Google
            </Button>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
              ¿No tienes cuenta?{' '}
              <Link href="/auth/register" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                Regístrate
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}