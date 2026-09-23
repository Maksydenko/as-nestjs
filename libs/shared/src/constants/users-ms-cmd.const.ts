/**
 * Redis message patterns for the users microservice.
 * Import the same cmds from a host app ClientProxy.
 */
export const UsersMsCmd = {
  AuthLogin: { cmd: 'auth.login' },
  AuthLogout: { cmd: 'auth.logout' },
  AuthRegister: { cmd: 'auth.register' },
  UsersDeleteMe: { cmd: 'users.deleteMe' },
  UsersFindMany: { cmd: 'users.findMany' },
  UsersMe: { cmd: 'users.me' },
  UsersUpdateMe: { cmd: 'users.updateMe' }
} as const
