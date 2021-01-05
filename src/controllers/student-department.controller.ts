import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Student,
  Department,
} from '../models';
import {StudentRepository} from '../repositories';

export class StudentDepartmentController {
  constructor(
    @repository(StudentRepository)
    public studentRepository: StudentRepository,
  ) { }

  @get('/students/{id}/department', {
    responses: {
      '200': {
        description: 'Department belonging to Student',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Department)},
          },
        },
      },
    },
  })
  async getDepartment(
    @param.path.number('id') id: typeof Student.prototype.id,
  ): Promise<Department> {
    return this.studentRepository.department(id);
  }
}
