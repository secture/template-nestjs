export class RefreshAccessTokenCommand {
  constructor(
    readonly userId: string,
    readonly refreshToken: string,
  ) {}
}
