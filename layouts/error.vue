<template>
  <v-app>
    <v-row justify="center">
      <v-col align-self="center" align="center">
        <h1>
          {{ mensagem }}
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
  head () {
    return {
      title: this.mensagem
    }
  },
  computed: {
    mensagem () {
      return this.error.message.length > 0 ? this.error.message : 'Ocorreu um erro'
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
