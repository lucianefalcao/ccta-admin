<template>
  <v-card class="pa-5">
    <v-card-actions>
      <back-button />
    </v-card-actions>
    <v-card-title class="mb-5">
      <h3>{{ pageTitle }}</h3>
    </v-card-title>
    <v-card-text>
      <v-textarea
        v-model="about"
        label="Sobre o centro"
        :rules="[rules.about.required, rules.about.length]"
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
import Center from '@/models/domain/Center'

@Component({
  components: {
    BackButton
  }
})
export default class CenterInfo extends Vue {
  @Prop({ type: String, required: true })
  pageTitle!: String

  @Prop({ type: Center!, default: null })
  center!: Center

  about: String = ''

  rules = {
    about: {
      required: (value: String) => !!value || 'Por favor, adicione uma breve descrição.',
      length: (value: String) => value.length < 400 || 'Máximo 400 caracteres'
    }
  }

  get canSave (): Boolean {
    return (this.about.length > 0)
  }

  publish (): void {
    const center = this.createCenterInfo()
    this.$emit('saveCenterInfo', center)
  }

  createCenterInfo (): Center {
    return {
      uid: this.center?.uid ?? undefined,
      lastModified: Date.now(),
      user: userStore.authUser,
      about: this.about
    }
  }

  mounted () {
    if (this.center) {
      this.about = this.center.about!
    }
  }
}
</script>
