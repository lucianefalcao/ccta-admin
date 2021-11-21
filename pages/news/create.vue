<template>
  <news-create
    :page-title="'Cadastrar notícia'"
    @updateNews="saveNews"
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
  errorMessage: String = ''

  async saveNews (news: News): Promise<void> {
    try {
      const newsSaved = await newsStore.save(news)
      this.$router.push('/news/' + newsSaved.uid)
    } catch (error) {
      this.errorMessage = 'Ocorreu um erro ao atualizar a notícia. Por favor, tente novamente.'
    }
  }
}
</script>
