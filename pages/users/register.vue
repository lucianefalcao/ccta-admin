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
  </v-col>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
import { required, email } from 'vee-validate/dist/rules'
import { extend, ValidationProvider, ValidationObserver } from 'vee-validate'
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
    ValidationObserver
  }
})
export default class Register extends Vue {
  name: String = ''
  email: String = ''

  $refs!: {
    observer: InstanceType<typeof ValidationObserver>
  }

  async register () {
    try {
      if (await this.$refs.observer.validate()) {
        await userStore.createUser({ name: this.name, email: this.email })
      }
    } catch (error) {
      console.log(error)
    }
  }
}
</script>
