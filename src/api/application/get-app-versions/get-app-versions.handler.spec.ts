import { GetAppVersionsHandler } from './get-app-versions.handler';

describe('GetAppVersionsHandler', () => {
  let handler: GetAppVersionsHandler;

  beforeEach(() => {
    handler = new GetAppVersionsHandler('1.0.0', '1.2.3');
  });

  it('should return the correct app versions', () => {
    const result = handler.handle();

    //expect(result).toBeInstanceOf(AppVersionsDto);
    expect(result.supportedVersion).toBe('1.0.0');
    expect(result.recommendedVersion).toBe('1.2.3');
  });
});
