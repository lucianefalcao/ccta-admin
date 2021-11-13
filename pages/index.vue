<template>
  <v-container class="auth-wrapper pa-0">
    <v-row justify="space-around">
      <v-card class="auth-card" width="400" height="400">
        <v-card-title class="d-flex align-center justify-center">
          <v-img
            src="/logo.svg"
            max-height="30px"
            max-width="30px"
            alt="logo"
            class="me-3"
            contain
          />
          <p class="text-2xl font-weight-medium mb-0">
            CCTA
          </p>
        </v-card-title>

        <v-card-text>
          <p class="text-2xl font-weight-medium text--primary mb-2">
            Bem vindo(a) ao CCTA Admin!
          </p>
          <p class="mb-2">
            Por favor, realize o login
          </p>
        </v-card-text>

        <v-card-text>
          <v-form>
            <v-text-field
              v-model="email"
              outlined
              label="Email"
              hide-details
              class="mb-3"
            />
            <v-text-field
              v-model="password"
              :type="isPasswordVisible ? 'text' : 'password'"
              :append-icon="isPasswordVisible ? icons.mdiEyeOffOutline : icons.mdiEyeOutline"
              outlined
              label="Senha"
              hide-details
              class="mb-3"
              @click:append="isPasswordVisible = !isPasswordVisible"
            />

            <v-btn
              block
              color="primary"
              class="mt-6"
            >
              Login
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-row>
  </v-container>
</template>

<script lang="ts">

import { Vue, Component } from 'vue-property-decorator'
import { mdiEyeOffOutline, mdiEyeOutline } from '@mdi/js'

@Component({
  layout: 'empty'
})
export default class Index extends Vue {
  email: string = ''
  password: string = ''
  isPasswordVisible: Boolean = false
  icons: Object = {
    mdiEyeOffOutline,
    mdiEyeOutline
  }
}
</script>

<style>
.auth-card {
  padding: 0.9375rem 0.875rem;
}
.text-2xl {
  font-size: 1.5rem !important;
  line-height: 2rem !important;
}
.auth-wrapper {
  display: flex;
  min-height: 95vh;
  width: 100%;
  flex-basis: 100%;
  align-items: center;
}
</style>
