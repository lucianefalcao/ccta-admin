<template>
  <v-col align-self="start">
    <course-fields
      :page-title="'Cadastrar Curso'"
      @saveCourse="saveCourse"
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
import { courseStore } from '@/store'
import CourseFields from '@/components/CourseFields.vue'
import Snackbar from '@/components/Snackbar.vue'
import Course from '@/models/domain/Course'

@Component({
  components: {
    CourseFields,
    Snackbar
  }
})
export default class Publish extends Vue {
  errorMessage: String = ''
  snackbar: Boolean = false

  setSnackbar (snackbar: Boolean): void {
    this.snackbar = snackbar
  }

  async saveCourse (course: Course): Promise<void> {
    try {
      console.log('aqui')
      const courseSaved = await courseStore.save(course)
      this.$router.push(`/info-centro/courses/${courseSaved.uid}`)
    } catch (error) {
      this.errorMessage = 'Ocorreu um erro ao publicar as informações. Por favor, tente novamente.'
      this.snackbar = true
    }
  }
}
</script>
