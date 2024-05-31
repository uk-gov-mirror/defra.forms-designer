export default /** @satisfies {ServerRoute} */ ({
  method: 'GET',
  path: '/',
  handler() {
    return '<a href="/auth/callback">Click to initiate sign-in process and get your token.</a>'
  }
})

/**
 * @typedef {import('@hapi/hapi').ServerRoute} ServerRoute
 */
