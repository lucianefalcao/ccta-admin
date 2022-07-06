<template>
  <v-text-field
    v-model="senha"
    :label="label"
    outlined
    required
    :dense="dense"
    :type="senhaVisivel ? 'text' : 'password'"
    :append-icon="senhaVisivel ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
    :rules="regraSenha"
    @click:append="senhaVisivel = !senhaVisivel"
    @input="enviarSenha"
  />
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class CampoSenha extends Vue {
  senha = ''
  senhaVisivel = false

  @Prop({ required: false, default: 'Senha' })
  label: string

  @Prop({ required: false, default: false })
  dense: boolean

  regraSenha = [
    (v: string): boolean|string => !!v || 'A senha é obrigatória',
    (v: string): boolean|string => v.length >= 6 || 'A senha deve ter no mínimo 6 caracteres'
  ]

  senhaValida (): void {
    if (this.regraSenha.every(element => element(this.senha) === true)) {
      this.$emit('senhaValida', true)
    } else {
      this.$emit('senhaValida', false)
    }
  }

  enviarSenha (): void {
    this.$emit('senha', this.senha)
    this.senhaValida()
  }
}
</script>
