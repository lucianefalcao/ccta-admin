<template>
  <v-col align-self="start">
    <news-create
      :page-title="'Cadastrar notícia'"
      @updateNews="saveNews"
    />

    <snackbar
      v-if="snackbar"
      :snackbar="snackbar"
      :message="errorMessage"
      @closeSnackbar="setSnackbar"
    />
  </v-col>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
import { newsStore } from '@/store'
import NewsCreate from '@/components/NewsCreate.vue'
import Snackbar from '@/components/Snackbar.vue'
import News from '~/models/domain/News'

@Component({
  components: {
    NewsCreate,
    Snackbar
  }
})
export default class Create extends Vue {
  errorMessage: String = ''
  snackbar: Boolean = false

  setSnackbar (snackbar: Boolean): void {
    this.snackbar = snackbar
  }

  async saveNews (news: News): Promise<void> {
    try {
      const newsSaved = await newsStore.save(news)
      this.$router.push('/news/' + newsSaved.uid)
    } catch (error) {
      this.errorMessage = 'Ocorreu um erro ao atualizar a notícia. Por favor, tente novamente.'
      this.snackbar = true
    }
  }
}
</script>
