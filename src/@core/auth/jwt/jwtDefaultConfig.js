export default {
  // Endpoints
  loginEndpoint: 'accounts/dashboard/login/',
  registerEndpoint: 'accounts/register/',
  refreshEndpoint: 'accounts/auth/token/refresh/',
  logoutEndpoint: '/jwt/logout',

  // This will be prefixed in authorization header with token
  // e.g. Authorization: Bearer <token>
  tokenType: 'Bearer',

  // Value of this property will be used as key to store JWT token in storage
  storageTokenKeyName: 'access',
  storageRefreshTokenKeyName: 'refresh',
}
