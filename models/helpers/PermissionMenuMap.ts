import { Permissao } from '~/src/aplicacao/usuarios/entidade/usuario'

type Menu = {
  icone: string,
  titulo: string,
  to: string,
  tipo: string,
  permissao?: Permissao
}

const menuPermissionMap: Menu[] = [
  {
    icone: 'mdi-newspaper-variant-outline',
    titulo: 'Notícias',
    to: '/noticias',
    tipo: 'primario',
    permissao: Permissao.GERENCIAR_NOTICIAS
  },
  {
    icone: 'mdi-calendar',
    titulo: 'Eventos',
    to: '/eventos',
    tipo: 'primario',
    permissao: Permissao.GERENCIAR_EVENTOS
  },
  {
    icone: 'mdi-bullhorn-outline',
    titulo: 'Editais',
    to: '/editais',
    tipo: 'primario',
    permissao: Permissao.GERENCIAR_EDITAIS
  },
  {
    icone: 'mdi-chat-alert-outline',
    titulo: 'Atendimento',
    to: '/atendimento',
    tipo: 'primario',
    permissao: Permissao.GERENCIAR_CHAT
  },
  {
    icone: 'mdi-office-building-outline',
    titulo: 'Informações do centro',
    to: '/info-centro',
    tipo: 'primario',
    permissao: Permissao.GERENCIAR_CENTRO
  },
  {
    icone: 'mdi-account-outline',
    titulo: 'Perfil',
    to: '/perfil',
    tipo: 'secundario'
  },
  {
    icone: 'mdi-tune-variant',
    titulo: 'Gerenciar usuários',
    to: '/usuarios',
    tipo: 'secundario',
    permissao: Permissao.GERENCIAR_USUARIOS
  }
]

export { Menu, menuPermissionMap }
