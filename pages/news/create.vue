<template>
  <news-create
    :page-title="'Cadastrar notícia'"
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
export default class Create extends Vue {
  async saveAsDraft (news: News): Promise<void> {
    const newsSaved = await newsStore.save(news)
    this.$router.push('/news/' + newsSaved.uid)
  }

  async publish (news: News): Promise<void> {
    const newsSaved = await newsStore.save(news)
    this.$router.push('/news/' + newsSaved.uid)
  }
}
</script>
