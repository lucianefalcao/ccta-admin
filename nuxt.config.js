import colors from 'vuetify/es5/util/colors'

export default {
  ssr: false,
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - ccta-admin',
    title: 'CCTA',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/firebase',
    '~/plugins/datetime-picker'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  router: {
    middleware: ['autenticacao-middleware']
  },

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/firebase'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // Firebase module configuration
  firebase: {
    config: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID
    },
    services: {
      auth: {
        initialize: {
          onAuthStateChangedAction: 'usuarios/onAuthStateChanged',
          subscribeManually: false
        },
        emulatorPort: process.env.ENV === 'dev' ? 9099 : null
      },
      firestore: {
        enablePersistence: false,
        emulatorPort: process.env.ENV === 'dev' ? 8082 : null
      },
      storage: {
        emulatorPort: process.env.ENV === 'dev' ? 9199 : null
      },
      functions: {
        location: 'us-central1',
        emulatorPort: process.env.ENV === 'dev' ? 1234 : null
      },
      database: {
        emulatorPort: process.env.ENV === 'dev' ? 9001 : null
      }
    }
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        light: {
          primary: '#FF5252',
          accent: '#5AB1BB',
          secondary: '#02394A',
          info: '#16B1FF',
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: '#56CA00'
        }
      }
    }
  }
}
