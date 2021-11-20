<template>
  <v-col align-self="start">
    <v-card class="pa-5">
      <v-card-actions>
        <back-button />
      </v-card-actions>
      <v-card-title class="mb-5">
        <h3>Cadastrar notícia</h3>
      </v-card-title>
      <v-card-text>
        <div class="mb-5">
          <v-btn
            color="primary"
            class="text-none"
            :loading="isSelectingFile"
            depressed
            rounded
            @click="chooseCover"
          >
            <v-icon left>
              {{ icons.mdiUpload }}
            </v-icon>
            {{ buttonText }}
          </v-btn>

          <v-btn icon small>
            <v-icon v-if="cover" right @click="clearFileSelection">
              {{ icons.mdiClose }}
            </v-icon>
          </v-btn>

          <input
            ref="uploader"
            class="d-none"
            type="file"
            accept="image/jpeg, image/png"
            @change="onFileChanged"
          >
        </div>

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
  </v-col>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
import Editor from '@tinymce/tinymce-vue'
import { mdiUpload, mdiClose } from '@mdi/js'
import BackButton from '@/components/BackButton.vue'
import { newsStore, userStore } from '@/store'

@Component({
  components: {
    Editor,
    BackButton
  }
})
export default class Create extends Vue {
  title: String = ''
  newsText: String = ''
  isSelectingFile: Boolean = false
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

  get buttonText (): String {
    return this.cover ? this.cover.name : 'Capa'
  }

  rules = {
    title: {
      required: (value: String) => !!value || 'Por favor, adicione um título.'
    }
  }

  icons = {
    mdiUpload,
    mdiClose
  }

  async saveAsDraft (): Promise<void> {
    this.cleanText()

    this.addCover()

    const news = await newsStore.save({
      title: this.title,
      newsText: this.newsText,
      state: 'draft',
      lastModified: Date.now(),
      user: userStore.authUser,
      coverPath: this.cover ? `newsPostsImage/${this.cover?.name}` : ''
    })

    this.$router.push('/news/' + news.uid)
  }

  async publish (): Promise<void> {
    this.cleanText()

    this.addCover()

    const news = await newsStore.save({
      title: this.title,
      newsText: this.newsText,
      state: 'published',
      lastModified: Date.now(),
      user: userStore.authUser,
      coverPath: this.cover ? `newsPostsImages/${this.cover?.name}` : ''
    })

    this.$router.push('/news/' + news.uid)
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

  chooseCover (): void {
    this.isSelectingFile = true
    window.addEventListener('focus', () => {
      this.isSelectingFile = false
    }, { once: true })

    const uploader = this.$refs.uploader as HTMLInputElement

    uploader.click()
  }

  onFileChanged (e: Event): void {
    const target = e.target as HTMLInputElement
    this.cover = target.files![0]
  }

  clearFileSelection (): void {
    this.cover = null
  }
}
</script>
