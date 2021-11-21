import { Action, Module, VuexModule } from 'vuex-module-decorators'
import Course from '@/models/domain/Course'
import CourseTransformer from '@/transformers/course-transformer'

@Module({ name: 'course', stateFactory: true, namespaced: true })
export default class CenterModule extends VuexModule {
  @Action({ rawError: true })
  async save (course: Course): Promise<Course> {
    const centerFirebase = CourseTransformer.transformModelToInfra(course)
    const centerRef = await this.store.$fire.firestore.collection('course').doc()
    await centerRef.set(centerFirebase)
    course.uid = centerRef.id
    return course
  }

  @Action({ rawError: true })
  async getAll (): Promise<Course[]> {
    const courses = await this.store.$fire.firestore.collection('course').get()
    const coursesPosts: Course[] = []
    for (const courseData of courses.docs) {
      const course = await CourseTransformer.transformInfraToModel(courseData.data(), courseData.id)
      coursesPosts.push(course)
    }

    return coursesPosts
  }

  @Action({ rawError: true })
  async update (course: Course): Promise<Course> {
    const courseFirebase = CourseTransformer.transformModelToInfra(course)
    const courseRef = await this.store.$fire.firestore.collection('course').doc(course.uid)
    await courseRef.update(courseFirebase)

    return course
  }

  @Action({ rawError: true })
  async delete (course: Course): Promise<Course[]> {
    const courseFirebase = CourseTransformer.transformModelToInfra(course)
    const courseRef = await this.store.$fire.firestore.collection('course').doc(course.uid)
    await courseRef.delete(courseFirebase)
    return await this.getAll()
  }
}
