import joi from 'joi'

export interface Config {
  port: number
  azureClientId?: string
  azureClientSecret?: string
  oidcWellKnownConfigurationUrl: string
  appBaseUrl: string
}

// Define config schema
const schema = joi.object<Config>({
  port: joi.number().default(3000),
  azureClientId: joi.string().required(),
  azureClientSecret: joi.string().required(),
  oidcWellKnownConfigurationUrl: joi.string().required(),
  appBaseUrl: joi.string().default('http://localhost:3000')
})

// Validate config
const result = schema.validate(
  {
    port: process.env.PORT,
    azureClientId: process.env.AZURE_CLIENT_ID,
    azureClientSecret: process.env.AZURE_CLIENT_SECRET,
    oidcWellKnownConfigurationUrl: process.env.OIDC_WELL_KNOWN_CONFIGURATION_URL
  },
  { abortEarly: false }
)

// Throw if config is invalid
if (result.error) {
  throw new Error(`The server config is invalid. ${result.error.message}`)
}

// Use the joi validated value
export default result.value
