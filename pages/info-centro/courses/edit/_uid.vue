<template>
  <v-col align-self="start">
    <div v-if="fetchingData" class="text-center">
      <v-progress-circular
        color="primary"
        indeterminate
      />
    </div>
    <course-fields
      v-else
      :page-title="'Editar Curso'"
      :course-props="course"
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
import { courseStore, userStore } from '@/store'
import CourseFields from '@/components/CourseFields.vue'
import Snackbar from '@/components/Snackbar.vue'
import Course from '@/models/domain/Course'

@Component({
  components: {
    CourseFields,
    Snackbar
  }
})
export default class Edit extends Vue {
  errorMessage: String = ''
  snackbar: Boolean = false
  fetchingData: Boolean = true

  course: Course = {
    name: '',
    type: '',
    subType: '',
    nrPeriods: 0,
    turno: 'M',
    description: '',
    user: userStore.authUser
  }

  setSnackbar (snackbar: Boolean): void {
    this.snackbar = snackbar
  }

  async saveCourse (course: Course): Promise<void> {
    try {
      const courseSaved = await courseStore.update(course)
      this.$router.push(`/info-centro/courses/${courseSaved.uid}`)
    } catch (error) {
      this.errorMessage = 'Ocorreu um erro ao atualizar o curso. Por favor, tente novamente.'
      this.snackbar = true
    }
  }

  async beforeCreate (): Promise<void> {
    try {
      this.course = await courseStore.getCourseByUid(this.$route.params.uid)
    } catch (error) {
      this.errorMessage = 'Ocorreu um erro ao buscar o curso. Por favor, tente novamente.'
      this.snackbar = true
    } finally {
      this.fetchingData = false
    }
  }
}
</script>
