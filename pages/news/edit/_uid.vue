<template>
  <v-col align-self="start">
    <div v-if="fetchingNews" class="text-center">
      <v-progress-circular
        color="primary"
        indeterminate
      />
    </div>
    <news-create
      v-else
      :page-title="'Editar notícia'"
      :news="news"
      @updateNews="updateNews"
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
import News from '@/models/domain/News'

@Component({
  components: {
    NewsCreate,
    Snackbar
  }
})
export default class Edit extends Vue {
  news: News = {
    uid: undefined,
    title: undefined,
    newsText: undefined,
    state: undefined,
    lastModified: undefined,
    user: undefined
  }

  coverURL: String = ''
  fetchingNews: Boolean = true
  snackbar: Boolean = false
  errorMessage: String = ''

  setSnackbar (snackbar: Boolean): void {
    this.snackbar = snackbar
  }

  async updateNews (news: News): Promise<void> {
    try {
      const newsSaved = await newsStore.updateNews(news)
      this.$router.push('/news/' + newsSaved.uid)
    } catch (error) {
      this.errorMessage = 'Ocorreu um erro ao atualizar a notícia. Por favor, tente novamente.'
      this.snackbar = true
    }
  }

  async beforeCreate (): Promise<void> {
    try {
      this.news = await newsStore.getNewsByUid(this.$route.params.uid)

      if (this.news.coverPath!.length > 0) {
        this.coverURL = await newsStore.getCover(this.news.coverPath!)
      }
    } catch (error) {
      this.errorMessage = 'Ocorreu um erro ao buscar a notícia. Por favor, tente novamente.'
      this.snackbar = true
    } finally {
      this.fetchingNews = false
    }
  }
}
</script>
