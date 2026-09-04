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
  className="btn-google"
  onClick={manejarLoginGoogle}
  disabled={cargando}
>
  <svg className="h-5 w-5" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
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