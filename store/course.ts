import { Action, Module, VuexModule } from 'vuex-module-decorators'
import { userStore } from '@/store'
import Course from '@/models/domain/Course'
import CourseTransformer from '@/transformers/course-transformer'

@Module({ name: 'course', stateFactory: true, namespaced: true })
export default class CenterModule extends VuexModule {
  @Action({ rawError: true })
  async save (course: Course): Promise<Course> {
    const courseFirebase = CourseTransformer.transformModelToInfra(course)
    const courseRef = await this.store.$fire.firestore.collection('courses').doc()
    await courseRef.set(courseFirebase)
    course.uid = courseRef.id
    return course
  }

  @Action({ rawError: true })
  async getAll (): Promise<Course[]> {
    const courses = await this.store.$fire.firestore.collection('courses').orderBy('name').get()
    const coursesPosts: Course[] = []
    for (const courseData of courses.docs) {
      const course = await CourseTransformer.transformInfraToModel(courseData.data(), courseData.id)
      coursesPosts.push(course)
    }

    return coursesPosts
  }

  @Action({ rawError: true })
  async getCourseByUid (uid: String): Promise<Course> {
    const course = await this.store.$fire.firestore.collection('courses').doc(uid).get()
    const user = await userStore.getUserByUid(course.data().userUid)
    return {
      uid: course.id,
      name: course.data().name,
      description: course.data().description,
      lastModified: course.data().lastModified,
      user,
      turno: course.data().turno,
      type: course.data().type,
      subType: course.data().subType,
      nrPeriods: course.data().nrPeriods
    }
  }

  @Action({ rawError: true })
  async update (course: Course): Promise<Course> {
    const courseFirebase = CourseTransformer.transformModelToInfra(course)
    const courseRef = await this.store.$fire.firestore.collection('courses').doc(course.uid)
    await courseRef.update(courseFirebase)

    return course
  }

  @Action({ rawError: true })
  async delete (course: Course): Promise<Course[]> {
    const courseFirebase = CourseTransformer.transformModelToInfra(course)
    const courseRef = await this.store.$fire.firestore.collection('courses').doc(course.uid)
    await courseRef.delete(courseFirebase)
    return await this.getAll()
  }
}
