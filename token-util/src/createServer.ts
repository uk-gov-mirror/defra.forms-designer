import hapi, { type ServerOptions } from '@hapi/hapi'

import { azureOidc } from '~/src/common/helpers/auth/azure-oidc.js'
import config from '~/src/config.js'
import router from '~/src/plugins/router.js'

const serverOptions = (): ServerOptions => {
  return {
    port: config.port,
    router: {
      stripTrailingSlash: true
    },
    routes: {
      validate: {
        options: {
          abortEarly: false
        }
      }
    }
  }
}

export async function createServer() {
  const server = hapi.server(serverOptions())

  await server.register(azureOidc)
  await server.register(router)

  return server
}
