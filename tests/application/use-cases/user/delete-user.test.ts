import { describe, expect, it, vi } from 'vitest'
import { DeleteUserUseCase } from '../../../../src/application/use-cases/user/delete-user'
import { User } from '../../../../src/domain/entities/user'
import { UserRepository } from '../../../../src/domain/repositories/user-repository'

function makeSut() {
    const userRepository: UserRepository = {
        create: vi.fn(),
        findByEmail: vi.fn(),
        findById: vi.fn(),
        findAll: vi.fn(),
        delete: vi.fn(),
    }
    const deleteUserUseCase = new DeleteUserUseCase(userRepository)

    return {
        userRepository,
        deleteUserUseCase,
    }
}

describe('DeleteUserUseCase', () => {
    it('should delete an existing user', async () => {
        const { userRepository, deleteUserUseCase } = makeSut()
        const user = User.create({
            id: 'user-1',
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: 'hashed-password123',
        })
        vi.mocked(userRepository.findById).mockResolvedValue(user)

        await deleteUserUseCase.execute({ id: 'user-1' })

        expect(userRepository.findById).toHaveBeenCalledWith('user-1')
        expect(userRepository.delete).toHaveBeenCalledWith('user-1')
    })

    it('should throw when user does not exist', async () => {
        const { userRepository, deleteUserUseCase } = makeSut()
        vi.mocked(userRepository.findById).mockResolvedValue(null)

        await expect(deleteUserUseCase.execute({ id: 'missing-user' }))
            .rejects.toMatchObject({
                message: 'User not found.',
                statusCode: 404,
            })
        expect(userRepository.delete).not.toHaveBeenCalled()
    })
})
