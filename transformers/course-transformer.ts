import Course from '@/models/domain/Course'
import CourseFirebase from '@/models/firebase/CourseFirebase'
import { userStore } from '@/store'

export default class CourseTransformer {
  static async transformInfraToModel (course: CourseFirebase, courseUid: String): Promise<Course> {
    const user = await userStore.getUserByUid(course.userUid)
    return {
      uid: courseUid,
      name: course.name,
      type: course.type,
      lastModified: course.lastModified,
      user,
      description: course.description,
      nrPeriods: course.nrPeriods,
      turno: course.turno,
      subType: course.subType
    }
  }

  static transformModelToInfra (course: Course): CourseFirebase {
    return {
      name: course.name!,
      lastModified: course.lastModified!,
      userUid: course.user!.uid!,
      type: course.type!,
      description: course.description!,
      nrPeriods: course.nrPeriods!,
      turno: course.turno!,
      subType: course.subType!
    }
  }
}
