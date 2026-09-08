import { crearClienteServidor } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function POST() {
  const supabase = await crearClienteServidor()
  await supabase.auth.signOut()
  redirect('/auth/login')
}