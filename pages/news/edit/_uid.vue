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
    @saveAsDraft="saveAsDraft"
    @publishNews="publish"
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

  async saveAsDraft (news: News): Promise<void> {
    const newsSaved = await newsStore.updateNews(news)
    this.$router.push('/news/' + newsSaved.uid)
  }

  async publish (news: News): Promise<void> {
    const newsSaved = await newsStore.updateNews(news)
    this.$router.push('/news/' + newsSaved.uid)
  }

  async beforeCreate (): Promise<void> {
    this.news = await newsStore.getNewsByUid(this.$route.params.uid)

    if (this.news.coverPath!.length > 0) {
      this.coverURL = await newsStore.getCover(this.news.coverPath!)
    }

    this.fetchingNews = false
  }
}
</script>
