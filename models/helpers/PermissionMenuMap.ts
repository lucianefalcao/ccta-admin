type Menu = {
  icon: String,
  title: String,
  to: String,
  type: String,
  permission: String
}

const menuPermissionMap: Menu[] = [
  {
    icon: 'mdi-newspaper-variant-outline',
    title: 'Notícias',
    to: '/news',
    type: 'primary',
    permission: 'gerenciar-noticias'
  },
  {
    icon: 'mdi-calendar',
    title: 'Eventos',
    to: '/events',
    type: 'primary',
    permission: 'gerenciar-eventos'
  },
  {
    icon: 'mdi-bullhorn-outline',
    title: 'Editais',
    to: '/editais',
    type: 'primary',
    permission: 'gerenciar-editais'
  },
  {
    icon: 'mdi-chat-alert-outline',
    title: 'Atendimento',
    to: '/chats',
    type: 'primary',
    permission: 'gerenciar-chat'
  },
  {
    icon: 'mdi-office-building-outline',
    title: 'Informações do centro',
    to: '/info-centro',
    type: 'primary',
    permission: 'gerenciar-info-centro'
  },
  {
    icon: 'mdi-account-outline',
    title: 'Perfil',
    to: '/perfil',
    type: 'secondary',
    permission: ''
  },
  {
    icon: 'mdi-tune-variant',
    title: 'Gerenciar usuários',
    to: '/users',
    type: 'secondary',
    permission: 'gerenciar-usuarios'
  },
  {
    icon: 'mdi-cog-outline',
    title: 'Configurações do site',
    to: '/configuracoes',
    type: 'secondary',
    permission: 'gerenciar-configuracoes'
  }
]

export { Menu, menuPermissionMap }
