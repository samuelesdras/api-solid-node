import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: 'Javascript Gym',
      description: '',
      phone: '',
      latitude: 16.3390899,
      longitude: -48.9303686,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 16.3390899,
      userLongitude: -48.9303686,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 16.3390899,
      userLongitude: -48.9303686,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: 16.3390899,
        userLongitude: -48.9303686,
      })
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  }),
    it('should be able to check in twice but in different days', async () => {
      vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

      await sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: 16.3390899,
        userLongitude: -48.9303686,
      })

      vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

      const { checkIn } = await sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: 16.3390899,
        userLongitude: -48.9303686,
      })
      expect(checkIn.id).toEqual(expect.any(String))
    })

  it('should should not be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'Javascript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-16.3355646),
      longitude: new Decimal(-48.9431772),
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: 16.3390899,
        userLongitude: -48.9303686,
      })
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
