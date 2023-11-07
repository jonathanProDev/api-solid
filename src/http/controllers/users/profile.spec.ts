import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user'

describe('Profile (e2e) ', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it('shoud be able to get user Profile', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const profileResponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send()
    expect(profileResponse.statusCode).toEqual(200)
    expect(profileResponse.body.profile.user).toEqual(
      expect.objectContaining({
        email: 'jonathan123@gmail.com',
      }),
    )
  })
})
