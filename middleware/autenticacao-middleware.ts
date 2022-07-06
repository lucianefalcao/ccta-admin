import { Middleware } from '@nuxt/types'
import { usuarioStore } from '~/store/'

const autenticacaoMiddleware: Middleware = ({ route, redirect }) => {
  const usuarioAutenticado = usuarioStore.usuario?.getId()
  if (!route.path.includes('/auth') && !usuarioAutenticado) {
    return redirect('/auth/login')
  }
}

export default autenticacaoMiddleware
