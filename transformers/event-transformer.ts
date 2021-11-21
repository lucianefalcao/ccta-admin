import Event from '@/models/domain/Event'
import EventFirebase from '@/models/firebase/EventFirebase'
import { userStore } from '@/store'

export default class EventTransformer {
  static async transformInfraToModel (event: EventFirebase, eventUid: String): Promise<Event> {
    const user = await userStore.getUserByUid(event.userUid)
    return {
      uid: eventUid,
      title: event.title,
      lastModified: event.lastModified,
      user,
      description: event.description,
      date: event.date
    }
  }

  static transformModelToInfra (event: Event): EventFirebase {
    return {
      title: event.title!,
      lastModified: event.lastModified!,
      userUid: event.user!.uid!,
      description: event.description!,
      date: event.date!
    }
  }
}
