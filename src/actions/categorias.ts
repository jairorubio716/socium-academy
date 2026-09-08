'use server'

import { crearClienteServidor } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function obtenerCategorias() {
  const supabase = await crearClienteServidor()
  const { data, error } = await supabase
    .from('categorias')
    .select('*')
    .order('nombre')

  if (error) {
    console.error('Error al obtener categorías:', error)
    return []
  }

  return data || []
}

export async function crearCategoria(formData: FormData) {
  const supabase = await crearClienteServidor()
  const nombre = formData.get('nombre') as string
  const slug = formData.get('slug') as string

  if (!nombre || !slug) {
    throw new Error('Nombre y slug son requeridos')
  }

  const { data: usuario } = await supabase.auth.getUser()
  if (!usuario.user) {
    throw new Error('No autenticado')
  }

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('rol')
    .eq('id', usuario.user.id)
    .single()

  if (perfil?.rol !== 'ADMIN') {
    throw new Error('No tienes permisos para realizar esta acción')
  }

  const { error } = await supabase
    .from('categorias')
    .insert({ nombre, slug })

  if (error) {
    console.error('Error al crear categoría:', error)
    throw new Error('Error al crear la categoría')
  }

  revalidatePath('/admin/categorias')
  redirect('/admin/categorias')
}

export async function editarCategoria(id: number, formData: FormData) {
  const supabase = await crearClienteServidor()
  const nombre = formData.get('nombre') as string
  const slug = formData.get('slug') as string

  if (!nombre || !slug) {
    throw new Error('Nombre y slug son requeridos')
  }

  const { data: usuario } = await supabase.auth.getUser()
  if (!usuario.user) {
    throw new Error('No autenticado')
  }

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('rol')
    .eq('id', usuario.user.id)
    .single()

  if (perfil?.rol !== 'ADMIN') {
    throw new Error('No tienes permisos para realizar esta acción')
  }

  const { error } = await supabase
    .from('categorias')
    .update({ nombre, slug })
    .eq('id', id)

  if (error) {
    console.error('Error al editar categoría:', error)
    throw new Error('Error al editar la categoría')
  }

  revalidatePath('/admin/categorias')
  redirect('/admin/categorias')
}

export async function eliminarCategoria(id: number) {
  const supabase = await crearClienteServidor()

  const { data: usuario } = await supabase.auth.getUser()
  if (!usuario.user) {
    throw new Error('No autenticado')
  }

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('rol')
    .eq('id', usuario.user.id)
    .single()

  if (perfil?.rol !== 'ADMIN') {
    throw new Error('No tienes permisos para realizar esta acción')
  }

  const { error } = await supabase
    .from('categorias')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error al eliminar categoría:', error)
    throw new Error('Error al eliminar la categoría')
  }

  revalidatePath('/admin/categorias')
  redirect('/admin/categorias')
}