import { User as UserEntity } from '../src/application/entities'
import { UserRole } from '../src/application/enums/role.enum'

declare global {
  namespace Express {
    interface User extends UserEntity {
      role: UserRole
    }
  }
}
