export const environment = {
  production: false,

  // API running on your machine
  apiUrl: 'http://localhost:4000',

  // MSAL (Entra) — dev
  auth: {
    tenantId: 'b39ef6b0-f4c4-4266-b067-f0ae2067d705',
    clientId: 'a0ad0e5a-783c-4479-aef8-877d5da4bef7',
    authority: 'https://login.microsoftonline.com/b39ef6b0-f4c4-4266-b067-f0ae2067d705',
    redirectUri: 'https://zealous-pebble-0add19e0f-production.eastus2.1.azurestaticapps.net/',
    apiScope: 'api://9d05af9d-cfdd-410a-8f84-c3842cd075c9/access_as_user'
  }
};