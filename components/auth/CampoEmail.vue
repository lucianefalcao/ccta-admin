<template>
  <v-text-field
    v-model="email"
    outlined
    label="Email"
    required
    :dense="dense"
    :rules="regraEmail"
    @input="enviarEmail"
  />
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class CampoEmail extends Vue {
  @Prop({ required: false, default: false })
  dense: boolean

  @Prop({ required: false, default: '' })
  valorInicial: string

  email = ''

  regraEmail = [
    (v: string): boolean|string => !!v || 'O e-mail é obrigatório',
    (v: string): boolean|string => /.+@.+\..+/.test(v) || 'O e-mail inválido'
  ]

  emailValido (): void {
    if (this.regraEmail.every(element => element(this.email) === true)) {
      this.$emit('emailValido', true)
    }
  }

  enviarEmail (): void {
    this.$emit('email', this.email)
    this.emailValido()
  }

  mounted (): void {
    this.email = this.valorInicial
  }
}
</script>
