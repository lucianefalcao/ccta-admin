<template>
  <v-app>
    <v-row justify="center">
      <v-col align-self="center" align="center">
        <h1 v-if="error.statusCode === 403">
          {{ error.message }}
        </h1>
        <h1 v-if="error.statusCode === 404">
          {{ otherError }}
        </h1>
        <NuxtLink to="/">
          Voltar
        </NuxtLink>
      </v-col>
    </v-row>
  </v-app>
</template>

<script>
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      pageNotFound: 'Essa página não existe',
      authorization: 'Você não possui permissão',
      otherError: 'Ocorreu um erro'
    }
  },
  head () {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
