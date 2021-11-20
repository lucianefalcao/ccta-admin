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
          required
          outlined
        />

        <editor
          api-key="no-api-key"
          :init="editorConfig"
        />
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
import Editor from '@tinymce/tinymce-vue'

@Component({
  components: {
    Editor
  }
})
export default class Create extends Vue {
  title: String = ''

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
    link_assume_external_targets: 'https',
    paste_postprocess: (_: any, args: any): void => {
      console.log(args.node)
    }
  }
}
</script>
