import Course from '@/models/domain/Course'
import CourseFirebase from '@/models/firebase/CourseFirebase'
import { userStore } from '@/store'

export default class CourseTransformer {
  static async transformInfraToModel (course: CourseFirebase, courseUid: String): Promise<Course> {
    const user = await userStore.getUserByUid(course.usuario)
    return {
      uid: courseUid,
      name: course.nome,
      type: course.tipo,
      lastModified: course.ultimaModificacao,
      user,
      description: course.descricao,
      nrPeriods: course.nrPeriodos,
      turno: course.turno,
      subType: course.subtipo
    }
  }

  static transformModelToInfra (course: Course): CourseFirebase {
    return {
      nome: course.name!,
      ultimaModificacao: course.lastModified!,
      usuario: course.user!.uid!,
      tipo: course.type!,
      descricao: course.description!,
      nrPeriodos: course.nrPeriods!,
      turno: course.turno!,
      subtipo: course.subType!
    }
  }
}
