import { join } from 'node:path'

import config from '~/src/config.js'

const oneDay = 24 * 60 * 60
const oneYear = 365 * oneDay

/**
 * @type {RouteOptionsCache}
 */
const shortLivedCache = {
  expiresIn: oneDay * 1000,
  privacy: 'public'
}

/**
 * Only content-hashed in production builds (see webpack.config.js output.filename),
 * so a long cache is only safe to apply there - in development and test the
 * same unhashed URL can change content on every rebuild, so caching is left
 * off (matching Hapi's uncached default) to avoid serving stale assets.
 * @type {RouteOptionsCache | undefined}
 */
const longLivedCache = config.isProduction
  ? {
      expiresIn: oneYear * 1000,
      privacy: 'public'
    }
  : undefined

export default [
  /**
   * @satisfies {ServerRoute}
   */
  ({
    method: 'GET',
    path: '/robots.txt',
    options: {
      auth: false,
      cache: shortLivedCache,
      handler: {
        file: join(config.appDir, 'public', 'static', 'robots.txt')
      }
    }
  }),

  /**
   * Content-hashed filenames in production (e.g. application.0ac9cfa.min.js)
   * so the same URL never changes content there - safe to cache for a long
   * time. See longLivedCache above for the development/test behaviour.
   * @satisfies {ServerRoute}
   */
  ({
    method: 'GET',
    path: '/javascripts/{path*}',
    options: {
      auth: false,
      cache: longLivedCache,
      handler: {
        directory: {
          path: join(config.clientDir, 'javascripts')
        }
      }
    }
  }),

  /**
   * Content-hashed filenames in production (e.g. application.00cd641.min.css)
   * so the same URL never changes content there - safe to cache for a long
   * time. See longLivedCache above for the development/test behaviour.
   * @satisfies {ServerRoute}
   */
  ({
    method: 'GET',
    path: '/stylesheets/{path*}',
    options: {
      auth: false,
      cache: longLivedCache,
      handler: {
        directory: {
          path: join(config.clientDir, 'stylesheets')
        }
      }
    }
  }),

  /**
   * Unhashed filenames (images, fonts, downloads, translations) that can
   * change between deploys - cache for a shorter period.
   * @satisfies {ServerRoute}
   */
  ({
    method: 'GET',
    path: '/assets/{path*}',
    options: {
      auth: false,
      cache: shortLivedCache,
      handler: {
        directory: {
          path: join(config.clientDir, 'assets')
        }
      }
    }
  })
]

/**
 * @import { RouteOptionsCache, ServerRoute } from '@hapi/hapi'
 */
