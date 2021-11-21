import { Action, Module, VuexModule } from 'vuex-module-decorators'
import { userStore } from '@/store'
import Event from '@/models/domain/Event'
import EventTransformer from '@/transformers/event-transformer'

@Module({ name: 'events', stateFactory: true, namespaced: true })
export default class EventsModule extends VuexModule {
  @Action({ rawError: true })
  async save (event: Event): Promise<Event> {
    const eventFirebase = EventTransformer.transformModelToInfra(event)
    const eventRef = await this.store.$fire.firestore.collection('events').doc()
    await eventRef.set(eventFirebase)
    event.uid = eventRef.id
    return event
  }

  @Action({ rawError: true })
  async getAll (): Promise<Event[]> {
    const events = await this.store.$fire.firestore.collection('events').get()
    const eventsPosts: Event[] = []
    for (const editalData of events.docs) {
      const news = await EventTransformer.transformInfraToModel(editalData.data(), editalData.id)
      eventsPosts.push(news)
    }

    return eventsPosts
  }

  @Action({ rawError: true })
  async getEventByUid (uid: String): Promise<Event> {
    const event = await this.store.$fire.firestore.collection('events').doc(uid).get()
    const user = await userStore.getUserByUid(event.data().userUid)
    return {
      uid: event.id,
      title: event.data().title,
      date: event.data().date,
      lastModified: event.data().lastModified,
      user,
      description: event.data().description
    }
  }

  @Action({ rawError: true })
  async update (event: Event): Promise<Event> {
    const eventFirebase = EventTransformer.transformModelToInfra(event)
    const eventRef = await this.store.$fire.firestore.collection('events').doc(event.uid)
    await eventRef.update(eventFirebase)

    return event
  }

  @Action({ rawError: true })
  async delete (event: Event): Promise<Event[]> {
    const eventFirebase = EventTransformer.transformModelToInfra(event)
    const eventRef = await this.store.$fire.firestore.collection('events').doc(event.uid)
    await eventRef.delete(eventFirebase)
    return await this.getAll()
  }
}
