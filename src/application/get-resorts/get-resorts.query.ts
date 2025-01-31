export class GetResortsQuery {
  constructor(
    readonly latitude?: number,
    readonly longitude?: number,
    readonly search?: string,
  ) {}
}
