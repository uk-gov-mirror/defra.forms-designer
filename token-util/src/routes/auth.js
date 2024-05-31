import { createUserSession } from '~/src/common/helpers/auth/user-session.js'

export default [
  /**
   * @satisfies {ServerRoute<{ AuthArtifactsExtra: AuthArtifacts }>}
   */
  ({
    method: ['GET', 'POST'],
    path: '/auth/callback',
    handler(request) {
      // Create user session
      const credentials = createUserSession(request)

      // return { credentials }
      return `
      <html>
        <head>
          <script type="application/javascript">
          function copyTokenToClipboard() {
            var accessTokenField = document.getElementById("accessToken");
            accessTokenField.select();
            accessTokenField.setSelectionRange(0, 99999);
            navigator.clipboard.writeText(accessTokenField.value);
            document.getElementById("copyButton").innerText = "Copied!";
          }
          </script>
        </head>
        <body>
          <h1>Hello, ${credentials.user.displayName}.</h1>
          <p><a href="/auth/callback">Get new token</a></p>
          <p>Your token is valid until: </b>${credentials.user.expiresAt}</p>

          <h3>Token</h3>
          <p>Use this to call the forms-manager API.</p>
          <button id="copyButton" onclick="copyTokenToClipboard()">Copy text</button>
          <input type="textarea" style="width:500px;" value="${credentials.token}" id="accessToken">
        </body>
      </html>
      `
    },
    options: {
      auth: {
        strategies: ['azure-oidc']
      }
    }
  })
]

/**
 * @typedef {import('@hapi/hapi').AuthArtifacts} AuthArtifacts
 */

/**
 * @template {import('@hapi/hapi').ReqRef} [ReqRef=import('@hapi/hapi').ReqRefDefaults]
 * @typedef {import('@hapi/hapi').ServerRoute<ReqRef>} ServerRoute
 */
