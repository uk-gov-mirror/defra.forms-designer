import { createServer } from '~/src/createServer.js'

describe('Assets routes', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop()
  })

  test('/javascripts/{path*} is not cached outside production', async () => {
    const { headers } = await server.inject({
      method: 'GET',
      url: '/javascripts/application.js'
    })

    expect(headers['cache-control']).toBe('no-cache')
  })

  test('/stylesheets/{path*} is not cached outside production', async () => {
    const { headers } = await server.inject({
      method: 'GET',
      url: '/stylesheets/application.css'
    })

    expect(headers['cache-control']).toBe('no-cache')
  })

  test('/assets/{path*} sets a short-lived cache-control header', async () => {
    const { headers } = await server.inject({
      method: 'GET',
      url: '/assets/images/favicon.ico'
    })

    expect(headers['cache-control']).toBe(
      'max-age=86400, must-revalidate, public'
    )
  })

  test('/robots.txt sets a short-lived cache-control header', async () => {
    const { headers } = await server.inject({
      method: 'GET',
      url: '/robots.txt'
    })

    expect(headers['cache-control']).toBe(
      'max-age=86400, must-revalidate, public'
    )
  })
})

describe('Assets routes in production', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.doMock('../config', () => ({
      __esModule: true,
      default: {
        appDir: '/app',
        clientDir: '/app/client',
        isProduction: true
      }
    }))
  })

  test('/javascripts/{path*} and /stylesheets/{path*} get a long-lived cache', async () => {
    const { default: routes } = await import('./assets.js')

    const javascripts = routes.find(
      (route) => route.path === '/javascripts/{path*}'
    )
    const stylesheets = routes.find(
      (route) => route.path === '/stylesheets/{path*}'
    )

    if (!javascripts || !stylesheets) {
      throw new Error('Expected routes not found')
    }

    expect(javascripts.options.cache).toEqual({
      expiresIn: 31536000000,
      privacy: 'public'
    })
    expect(stylesheets.options.cache).toEqual({
      expiresIn: 31536000000,
      privacy: 'public'
    })
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
