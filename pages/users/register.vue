<template>
  <v-col align-self="start">
    <v-card class="pa-5">
      <v-card-actions>
        <back-button />
      </v-card-actions>
      <v-card-title class="mb-5">
        Cadastrar usuário
      </v-card-title>

      <validation-observer
        ref="observer"
        v-slot="{invalid}"
      >
        <v-card-text>
          <v-row>
            <v-col sm="6" cols="12">
              <validation-provider
                v-slot="{errors}"
                name="Nome"
                rules="required"
              >
                <v-text-field
                  v-model="name"
                  label="Nome"
                  outlined
                  dense
                  :error-messages="errors"
                />
              </validation-provider>
            </v-col>
            <v-col sm="6" cols="12">
              <validation-provider
                v-slot="{ errors }"
                name="Email"
                rules="required|email"
              >
                <v-text-field
                  v-model="email"
                  label="Email"
                  outlined
                  dense
                  :error-messages="errors"
                />
              </validation-provider>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            depressed
            color="primary"
            :disabled="invalid"
            @click="register"
          >
            Cadastrar
          </v-btn>
        </v-card-actions>
      </validation-observer>
    </v-card>
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
import { required, email } from 'vee-validate/dist/rules'
import { extend, ValidationProvider, ValidationObserver } from 'vee-validate'
import { FirebaseError } from '@firebase/util'
import Snackbar from '@/components/Snackbar.vue'
import { userStore } from '@/store/index'

extend('required', {
  ...required,
  message: 'Este campo não pode ser vazio.'
})

extend('email', {
  ...email,
  message: 'Por favor, adicione um email válido.'
})

@Component({
  components: {
    ValidationProvider,
    ValidationObserver,
    Snackbar
  }
})
export default class Register extends Vue {
  name: String = ''
  email: String = ''
  errorMessage: String = ''

  snackbar: Boolean = false

  $refs!: {
    observer: InstanceType<typeof ValidationObserver>
  }

  async register () {
    try {
      if (await this.$refs.observer.validate()) {
        const user = await userStore.createUser({ name: this.name, email: this.email })
        this.$router.push(`/users/permissions/${user.uid}`)
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === 'functions/unauthenticated') {
          this.errorMessage = 'Você não está autenticado. Por favor, realize o login novamente.'
          this.snackbar = true
        } else if (error.code === 'functions/already-exists') {
          this.errorMessage = 'Este email já está cadastrado para outro usuário'
          this.snackbar = true
        }
      }
    }
  }

  setSnackbar (snackbar: Boolean): void {
    this.snackbar = snackbar
  }
}
</script>
