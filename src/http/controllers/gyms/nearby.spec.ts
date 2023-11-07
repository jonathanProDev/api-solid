import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user'

describe('Nearby Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app)

    // await gymsRepository.create({
    //   title: 'Near Gym',
    //   description: 'Academia 1',
    //   phone: '61999999999',
    //   latitude: -15.8066746,
    //   longitude: -47.947488,
    // })

    // await gymsRepository.create({
    //   title: 'Far Gym',
    //   description: 'Academia 2',
    //   phone: '61999999999',
    //   latitude: -15.811827,
    //   longitude: -48.096493,
    // })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JavaScript Gym',
        description: 'Some description.',
        phone: '1199999999',
        latitude: -15.8066746,
        longitude: -47.947488,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'TypeScript Gym',
        description: 'Some description.',
        phone: '1199999999',
        latitude: -15.811827,
        longitude: -48.096493,
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -15.8066746,
        longitude: -47.947488,
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
