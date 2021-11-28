import { Middleware } from '@nuxt/types'
import { userStore } from '@/store'

const permissionMiddleware: Middleware = ({ route, error }) => {
  const permissionCodes = userStore.userPermissions.map(e => e.code)

  if (route.path === '/news' && !permissionCodes.includes('gerenciar-noticas')) {
    error({ statusCode: 403, message: 'Você não possui permissão para acessar a página de notícias' })
  }

  if (route.path === '/events' && !permissionCodes.includes('gerenciar-eventos')) {
    error({ statusCode: 403, message: 'Você não possui permissão para acessar a página de eventos' })
  }

  if (route.path === '/editais' && !permissionCodes.includes('gerenciar-editais')) {
    error({ statusCode: 403, message: 'Você não possui permissão para acessar a página de editais' })
  }

  if (route.path === '/info-centro' && !permissionCodes.includes('gerenciar-info-centro')) {
    error({ statusCode: 403, message: 'Você não possui permissão para acessar a página de informações do centro' })
  }

  if (route.path === '/users' && !permissionCodes.includes('gerenciar-usuarios')) {
    error({ statusCode: 403, message: 'Você não possui permissão para gerenciar usuários' })
  }

  if (route.path === '/chat' && !permissionCodes.includes('gerenciar-chat')) {
    error({ statusCode: 403, message: 'Você não possui permissão para acessar a página de atendimento' })
  }

  if (route.path === '/configuracoes' && !permissionCodes.includes('gerenciar-configuracoes')) {
    error({ statusCode: 403, message: 'Você não possui permissão para acessar a página de configurações' })
  }
}

export default permissionMiddleware
