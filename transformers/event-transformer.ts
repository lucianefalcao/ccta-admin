import Event from '@/models/domain/Event'
import EventFirebase from '@/models/firebase/EventFirebase'
import { userStore } from '@/store'

export default class EventTransformer {
  static async transformInfraToModel (event: EventFirebase, eventUid: String): Promise<Event> {
    const user = await userStore.getUserByUid(event.criadoPor)
    return {
      uid: eventUid,
      title: event.titulo,
      lastModified: event.criadoEm,
      user,
      description: event.descricao,
      date: event.data
    }
  }

  static transformModelToInfra (event: Event): EventFirebase {
    return {
      titulo: event.title!,
      criadoEm: event.lastModified!,
      criadoPor: event.user!.uid!,
      descricao: event.description!,
      data: event.date!
    }
  }
}
