import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Search Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    // await gymsRepository.create({
    //   title: 'Near Gym',
    //   description: null,
    //   phone: null,
    //   latitude: 16.3390899,
    //   longitude: -48.9303686,
    // })

    // await gymsRepository.create({
    //   title: 'Far Gym',
    //   description: null,
    //   phone: null,
    //   latitude: -16.2863592,
    //   longitude: -48.979131,
    // })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JavaScript Gym',
        description: 'Some description',
        phone: '66644444220',
        latitude: 16.3390899,
        longitude: -48.9303686,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'TypeScript Gym',
        description: 'Some description',
        phone: '66644444220',
        latitude: -16.2863592,
        longitude: -48.979131,
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: 16.3390899,
        longitude: -48.9303686,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'JavaScript Gym',
      }),
    ])
  })
})
