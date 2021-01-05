import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Course,
  Student,
} from '../models';
import {CourseRepository} from '../repositories';

export class CourseStudentController {
  constructor(
    @repository(CourseRepository) protected courseRepository: CourseRepository,
  ) { }

  @get('/courses/{id}/students', {
    responses: {
      '200': {
        description: 'Array of Course has many Student',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Student)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Student>,
  ): Promise<Student[]> {
    return this.courseRepository.students(id).find(filter);
  }

  @post('/courses/{id}/students', {
    responses: {
      '200': {
        description: 'Course model instance',
        content: {'application/json': {schema: getModelSchemaRef(Student)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Course.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Student, {
            title: 'NewStudentInCourse',
            exclude: ['id'],
            optional: ['courseId']
          }),
        },
      },
    }) student: Omit<Student, 'id'>,
  ): Promise<Student> {
    return this.courseRepository.students(id).create(student);
  }

  @patch('/courses/{id}/students', {
    responses: {
      '200': {
        description: 'Course.Student PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Student, {partial: true}),
        },
      },
    })
    student: Partial<Student>,
    @param.query.object('where', getWhereSchemaFor(Student)) where?: Where<Student>,
  ): Promise<Count> {
    return this.courseRepository.students(id).patch(student, where);
  }

  @del('/courses/{id}/students', {
    responses: {
      '200': {
        description: 'Course.Student DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Student)) where?: Where<Student>,
  ): Promise<Count> {
    return this.courseRepository.students(id).delete(where);
  }
}
