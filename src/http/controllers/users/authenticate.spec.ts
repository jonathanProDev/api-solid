import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Authenyicate (e2e) ', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it('shoud be able to authenticate', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'jonathan123@gmail.com',
      password: '123456',
    })

    const respose = await request(app.server).post('/sessions').send({
      email: 'jonathan123@gmail.com',
      password: '123456',
    })

    expect(respose.status).toEqual(200)
    expect(respose.body).toEqual({
      token: expect.any(String),
    })
  })
})
