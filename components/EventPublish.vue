<template>
  <v-card class="pa-5">
    <v-card-actions>
      <back-button />
    </v-card-actions>
    <v-card-title class="mb-5">
      <h3>{{ pageTitle }}</h3>
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col>
          <v-text-field
            v-model="title"
            label="Título"
            :rules="[rules.title.required]"
            maxlength="60"
            counter
            required
            outlined
            class="mb-5"
          />
        </v-col>

        <v-col
          cols="12"
          sm="4"
        >
          <v-datetime-picker
            v-model="datetime"
            label="Data do evento"
            date-format="dd/MM/yyyy"
            :date-picker-props="dateProps"
            :time-picker-props="timeProps"
            :text-field-props="textProps"
          >
            <template slot="dateIcon">
              <v-icon>{{ icons.mdiCalendar }}</v-icon>
            </template>
            <template slot="timeIcon">
              <v-icon>{{ icons.mdiClockOutline }}</v-icon>
            </template>

            <template slot="actions" slot-scope="{ parent }">
              <v-btn text color="secondary" @click.native="parent.clearHandler">
                Limpar
              </v-btn>
              <v-btn text color="primary" @click="parent.okHandler">
                Ok
              </v-btn>
            </template>
          </v-datetime-picker>
        </v-col>
      </v-row>
      <v-textarea
        v-model="description"
        label="Descrição"
        :rules="[rules.description.required, rules.description.length]"
        :counter="200"
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
import { mdiCalendar, mdiClockOutline } from '@mdi/js'
import BackButton from '@/components/BackButton.vue'
import { userStore } from '@/store'
import Event from '@/models/domain/Event'

@Component({
  components: {
    BackButton
  }
})
export default class EventPublish extends Vue {
  @Prop({ type: String, required: true })
  pageTitle!: String

  @Prop({ type: Event!, default: null })
  event!: Event

  title: String = ''
  description: String = ''

  rules = {
    title: {
      required: (value: String) => !!value || 'Por favor, adicione um título.'
    },
    description: {
      required: (value: String) => !!value || 'Por favor, adicione uma breve descrição.',
      length: (value: String) => value.length < 200 || 'Máximo 200 caracteres'
    },
    date: {
      required: (value: Date) => !!value || 'Por favor, adicione a data do evento.'
    }
  }

  datetime: Date = new Date()
  dateProps = {
    headerColor: 'primary',
    color: 'secondary',
    locale: 'pt-br'
  }

  timeProps = {
    headerColor: 'primary',
    color: 'secondary',
    format: '24hr'
  }

  textProps = {
    rules: [this.rules.date.required],
    outlined: true,
    width: '100px'
  }

  icons = {
    mdiCalendar,
    mdiClockOutline
  }

  get canSave (): Boolean {
    return (this.title.length > 0) && (this.description.length > 0) && (this.datetime !== null)
  }

  publish (): void {
    const event = this.createEvent()
    this.$emit('saveEvent', event)
  }

  createEvent (): Event {
    return {
      uid: this.event?.uid ?? undefined,
      title: this.title,
      lastModified: Date.now(),
      user: userStore.authUser,
      date: Date.parse(this.datetime.toString()),
      description: this.description
    }
  }

  mounted () {
    if (this.event) {
      this.title = this.event.title!
      this.datetime = new Date(this.event.date!)
      this.description = this.event.description!
    }
  }
}
</script>
