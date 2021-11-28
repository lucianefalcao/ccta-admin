import { Middleware } from '@nuxt/types'
import { userStore } from '@/store'

const permissionMiddleware: Middleware = ({ route, error }) => {
  const permissionCodes = userStore.userPermissions.map(e => e.code)

  if (route.path.includes('/news') && !permissionCodes.includes('gerenciar-noticias')) {
    error({ statusCode: 403, message: 'Você não possui permissão para acessar a página de notícias' })
  }

  if (route.path.includes('/events') && !permissionCodes.includes('gerenciar-eventos')) {
    error({ statusCode: 403, message: 'Você não possui permissão para acessar a página de eventos' })
  }

  if (route.path.includes('/editais') && !permissionCodes.includes('gerenciar-editais')) {
    error({ statusCode: 403, message: 'Você não possui permissão para acessar a página de editais' })
  }

  if (route.path.includes('/info-centro') && !permissionCodes.includes('gerenciar-info-centro')) {
    error({ statusCode: 403, message: 'Você não possui permissão para acessar a página de informações do centro' })
  }

  if (route.path.includes('/users') && !permissionCodes.includes('gerenciar-usuarios')) {
    error({ statusCode: 403, message: 'Você não possui permissão para gerenciar usuários' })
  }

  if (route.path.includes('/chat') && !permissionCodes.includes('gerenciar-chat')) {
    error({ statusCode: 403, message: 'Você não possui permissão para acessar a página de atendimento' })
  }

  if (route.path.includes('/configuracoes') && !permissionCodes.includes('gerenciar-configuracoes')) {
    error({ statusCode: 403, message: 'Você não possui permissão para acessar a página de configurações' })
  }
}

export default permissionMiddleware
