<template>
  <v-card class="pa-5">
    <v-card-actions>
      <back-button />
    </v-card-actions>
    <v-card-title class="mb-5">
      <h3>{{ pageTitle }}</h3>
    </v-card-title>
    <v-card-text>
      <upload-file-button
        :file-name="coverName"
        :default-title="'Capa'"
        :accept-types="'image/jpeg, image/png'"
        @file="getCover"
      />

      <v-text-field
        v-model="title"
        label="Título"
        :rules="[rules.title.required]"
        maxlength="120"
        counter
        required
        outlined
        class="mb-5"
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
</template>

<script lang="ts">

import { Component, Vue, Prop } from 'vue-property-decorator'
import Editor from '@tinymce/tinymce-vue'
import BackButton from '@/components/BackButton.vue'
import UploadFileButton from '~/components/UploadFileButton.vue'
import { newsStore, userStore } from '@/store'
import News from '@/models/domain/News'

@Component({
  components: {
    Editor,
    BackButton,
    UploadFileButton
  }
})
export default class NewsCreate extends Vue {
  @Prop({ type: String, required: true })
  pageTitle!: String

  coverName: String = ''

  @Prop({ type: News!, default: null })
  news!: News

  title: String = ''
  newsText: String = ''
  cover: File | null = null

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

  saveAsDraft (): void {
    this.cleanText()
    this.addCover()

    const news = this.createNews('draft')

    this.$emit('updateNews', news)
  }

  publish (): void {
    this.cleanText()
    this.addCover()

    const news = this.createNews('published')

    this.$emit('updateNews', news)
  }

  async addCover (): Promise<String> {
    if (this.cover) {
      return await newsStore.addCover(this.cover)
    }
    return ''
  }

  cleanText (): void {
    this.newsText = this.newsText.split('<p>&nbsp;</p>').join('<br>')
    this.newsText = this.newsText.split('&nbsp;').join(' ')
  }

  getCover (cover: File): void {
    this.coverName = ''
    this.cover = cover
  }

  getCoverPath (): String {
    const bucket = 'newsPostsImages'
    if (this.cover) {
      return `${bucket}/${this.cover?.name}`
    } else if (this.coverName.length > 0) {
      return `${bucket}/${this.coverName}`
    }

    return ''
  }

  createNews (state: String): News {
    const coverPath = this.getCoverPath()

    return {
      uid: this.news?.uid ?? undefined,
      title: this.title,
      newsText: this.newsText,
      state,
      lastModified: Date.now(),
      user: userStore.authUser,
      coverPath
    }
  }

  mounted () {
    if (this.news) {
      this.title = this.news.title!
      this.newsText = this.news.newsText!
      this.coverName = this.news.coverPath?.split('/')[1]! ?? ''
    }
  }
}
</script>
