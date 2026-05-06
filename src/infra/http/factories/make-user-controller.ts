import { makeUserUseCases } from '../../../application/factories/make-user-use-cases'
import { UserController } from '../controllers/user-controller'

export function makeUserController(): UserController {
    return new UserController(makeUserUseCases())
}
