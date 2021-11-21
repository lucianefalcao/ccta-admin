<template>
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
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
import { newsStore } from '@/store'
import NewsCreate from '@/components/NewsCreate.vue'
import News from '~/models/domain/News'

@Component({
  components: {
    NewsCreate
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
  errorMessage: String = ''

  async updateNews (news: News): Promise<void> {
    try {
      const newsSaved = await newsStore.updateNews(news)
      this.$router.push('/news/' + newsSaved.uid)
    } catch (error) {
      this.errorMessage = 'Ocorreu um erro ao atualizar a notícia. Por favor, tente novamente.'
    }
  }

  async beforeCreate (): Promise<void> {
    try {
      this.news = await newsStore.getNewsByUid(this.$route.params.uid)

      if (this.news.coverPath!.length > 0) {
        this.coverURL = await newsStore.getCover(this.news.coverPath!)
      }

      this.fetchingNews = false
    } catch (error) {
      this.errorMessage = 'Ocorreu um erro ao buscar a notícia. Por favor, tente novamente.'
    }
  }
}
</script>
