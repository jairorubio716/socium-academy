import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function crearClienteServidor() {
  const almacenCookies = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(nombre: string) {
          return almacenCookies.get(nombre)?.value
        },
        set(nombre: string, valor: string, opciones: any) {
          almacenCookies.set({ nombre, valor, ...opciones })
        },
        remove(nombre: string, opciones: any) {
          almacenCookies.set({ nombre, valor: '', ...opciones })
        },
      },
    }
  )
}