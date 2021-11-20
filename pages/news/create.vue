<template>
  <v-col align-self="start">
    <v-card class="pa-5">
      <v-card-title>
        Cadastrar notícia
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="title"
          label="Título"
          :rules="[rules.title.required]"
          maxlength="120"
          counter
          required
          outlined
          class="pb-5"
        />

        <editor
          v-model="newsText"
          api-key="no-api-key"
          :init="editorConfig"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          depressed
          color="secondary"
          :disabled="!canSave"
          @click="saveAsDraft"
        >
          Salvar como rascunho
        </v-btn>
        <v-btn
          depressed
          :disabled="!canSave"
          color="primary"
          @click="publish"
        >
          Publicar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-col>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
import Editor from '@tinymce/tinymce-vue'
import { newsStore, userStore } from '@/store'

@Component({
  components: {
    Editor
  }
})
export default class Create extends Vue {
  title: String = ''
  newsText: String = ''

  editorConfig = {
    language: 'pt_BR',
    min_height: 500,
    menubar: false,
    plugins: [
      'advlist autolink lists link image wordcount emoticons',
      'searchreplace fullscreen autoresize paste'
    ],
    toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent link | searchreplace fullscreen emoticons',
    advlist_bullet_styles: 'circle',
    advlist_number_styles: 'default,lower-alpha,lower-roman',
    default_link_target: '_blank',
    link_assume_external_targets: 'https'
  }

  get canSave (): Boolean {
    return this.title.length > 0 && this.newsText.length > 0
  }

  rules = {
    title: {
      required: (value: String) => !!value || 'Por favor, adicione um título.'
    }
  }

  async saveAsDraft (): Promise<void> {
    this.cleanText()
    const news = await newsStore.save({
      title: this.title,
      newsText: this.newsText,
      state: 'draft',
      dateCreated: Date.now(),
      datePublished: 0,
      user: userStore.authUser
    })

    this.$router.push('/news/' + news.uid)
  }

  async publish (): Promise<void> {
    this.cleanText()
    const news = await newsStore.save({
      title: this.title,
      newsText: this.newsText,
      state: 'published',
      dateCreated: Date.now(),
      datePublished: Date.now(),
      user: userStore.authUser
    })

    this.$router.push('/news/' + news.uid)
  }

  cleanText (): void {
    this.newsText = this.newsText.split('<p>&nbsp;</p>').join('<br>')
    this.newsText = this.newsText.split('&nbsp;').join(' ')
  }
}
</script>
