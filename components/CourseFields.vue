<template>
  <v-card class="pa-5">
    <v-card-actions>
      <back-button />
    </v-card-actions>
    <v-card-title class="mb-5">
      <h3>{{ pageTitle }}</h3>
    </v-card-title>
    <v-card-text>
      <v-text-field
        v-model="course.name"
        label="Nome"
        :rules="rules.name"
        maxlength="60"
        counter
        required
        outlined
        class="mb-5"
      />

      <v-row>
        <v-col
          cols="12"
          sm="6"
        >
          <v-select
            v-model="course.type"
            :items="types"
            :rules="rules.type"
            item-text="label"
            item-value="type"
            attach
            outlined
            label="Tipo"
          />
        </v-col>
        <v-col
          v-if="course.type"
          cols="12"
          sm="6"
        >
          <v-select
            v-model="course.subType"
            :items="subTypes[course.type]"
            :rules="rules.subType"
            attach
            outlined
            label="Subtipo"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col
          cols="12"
          sm="6"
        >
          <v-select
            v-model="course.turno"
            :items="turnos"
            :rules="rules.turno"
            item-text="label"
            item-value="key"
            attach
            outlined
            label="Turno"
          />
        </v-col>
        <v-col
          cols="12"
          sm="6"
        >
          <v-text-field
            v-model="course.nrPeriods"
            label="Número de períodos"
            :rules="rules.nrPeriods"
            number
            outlined
          />
        </v-col>
      </v-row>

      <v-textarea
        v-model="course.description"
        label="Descrição"
        :rules="rules.description"
        :counter="400"
        required
        outlined
        class="mb-5"
      />
    </v-card-text>
    <v-card-actions>
      <v-spacer />
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
import BackButton from '@/components/BackButton.vue'
import { userStore } from '@/store'
import Course from '@/models/domain/Course'

@Component({
  components: {
    BackButton
  }
})
export default class CourseFields extends Vue {
  @Prop({ type: String, required: true })
  pageTitle!: String

  @Prop({ type: Course!, default: null })
  courseProps!: Course

  course: Course = {
    name: '',
    type: '',
    subType: '',
    nrPeriods: 0,
    turno: 'M',
    description: '',
    user: userStore.authUser
  }

  rules = {
    name: [(value: String) => !!value || 'Por favor, adicione um nome.'],
    type: [(value: String) => !!value || 'Por favor, escolha um tipo.'],
    subType: [(value: String) => !!value || 'Por favor, escolha um subtipo.'],
    nrPeriods: [(value: String) => !!value || 'Por favor, adicione a quantidade de períodos.'],
    turno: [(value: String) => !!value || 'Por favor, escolha um turno.'],
    description: [
      (value: String) => !!value || 'Por favor, adicione uma breve descrição.',
      (value: String) => value.length < 400 || 'Máximo 400 caracteres']
  }

  types: {type: String, label: String}[] = [
    { type: 'graduation', label: 'Graduação' },
    { type: 'pos', label: 'Pós-graduação' }
  ]

  subTypes: {graduation: String[], pos: String[]} = {
    graduation: ['Bacharelado', 'Licenciatura', 'Tecnólogo'],
    pos: ['Especialização', 'MBA', 'Mestrado', 'Doutorado', 'Pós-doutorado']
  }

  turnos: {key: String, label: String}[] = [
    { key: 'M', label: 'Manhã' },
    { key: 'T', label: 'Tarde' },
    { key: 'I', label: 'Integral' },
    { key: 'N', label: 'Noite' }
  ]

  get canSave (): Boolean {
    const name = this.rules.name.every((element: Function) => element(this.course.name) === true)
    const description = this.rules.description.every((element: Function) => element(this.course.description) === true)
    const turno = this.rules.turno.every((element: Function) => element(this.course.turno) === true)
    const nrPeriods = this.rules.nrPeriods.every((element: Function) => element(this.course.turno) === true)
    const type = this.rules.type.every((element: Function) => element(this.course.turno) === true)
    const subType = this.rules.subType.every((element: Function) => element(this.course.turno) === true)

    return name && description && turno && nrPeriods && type && subType
  }

  publish (): void {
    const course = this.createCourse()
    this.$emit('saveCourse', course)
  }

  createCourse (): Course {
    return {
      uid: this.courseProps?.uid ?? undefined,
      name: this.course.name,
      lastModified: Date.now(),
      user: userStore.authUser,
      type: this.course.type === 'graduation' ? 'Graduação' : 'Pós-graduação',
      subType: this.course.subType,
      nrPeriods: this.course.nrPeriods,
      turno: this.course.turno,
      description: this.course.description
    }
  }

  mounted () {
    if (this.courseProps) {
      this.course = this.courseProps
    }
  }
}
</script>
