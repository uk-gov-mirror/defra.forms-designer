import { type ServerRegisterPluginObject, type ServerRoute } from '@hapi/hapi'

import home from '~/src/routes/home.js'
import auth from '~/src/routes/auth.js'

export default {
  plugin: {
    name: 'router',
    register(server) {
      server.route(home)
      server.route(auth)
    }
  }
} as ServerRegisterPluginObject<void>
