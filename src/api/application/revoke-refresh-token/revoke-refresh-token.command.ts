export class RevokeRefreshTokenCommand {
  constructor(
    readonly userId: string,
    readonly refreshToken: string,
  ) {}
}
