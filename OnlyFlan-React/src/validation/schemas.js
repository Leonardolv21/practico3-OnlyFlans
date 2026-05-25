import * as yup from 'yup'

export const loginSchema = yup.object({
  email: yup.string().trim().email('Email invalido').required('Email requerido'),
  password: yup.string().required('Contrasena requerida'),
})

export const registerSchema = yup.object({
  name: yup.string().trim().min(3, 'Minimo 3 caracteres').required('Nombre requerido'),
  email: yup.string().trim().email('Email invalido').required('Email requerido'),
  password: yup.string().min(6, 'Minimo 6 caracteres').required('Contrasena requerida'),
  role: yup.string().oneOf(['creator', 'follower']).required('Rol requerido'),
})

export const createGoalSchema = yup.object({
  title: yup.string().trim().required('Titulo requerido'),
  description: yup.string().trim().required('Descripcion requerida'),
})

export const createPostSchema = yup.object({
  text: yup.string().transform((value) => (value || '').trim()),
  image_url: yup.string().transform((value) => (value || '').trim()).url('URL invalida').nullable(),
}).test('text-or-image', 'Debes poner texto o URL de imagen', (value) => {
  const text = value?.text || ''
  const imageUrl = value?.image_url || ''
  return Boolean(text || imageUrl)
})

export const donationSchema = yup.object({
  flans: yup
    .number()
    .typeError('Flanes debe ser numero')
    .integer('Debe ser entero')
    .min(1, 'Minimo 1 flan')
    .required('Flanes requeridos'),
})
