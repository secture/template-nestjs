import { HttpException } from '@nestjs/common';
import { VersionCheckMiddleware } from './version-check.middleware';

describe('VersionCheckMiddleware', () => {
  let middleware: VersionCheckMiddleware;
  const mockConfigService = {
    getOrThrow: jest.fn((key: string) => {
      if (key === 'MIN_SUPPORTED_VERSION') return '1.0.0';
      if (key === 'RECOMMENDED_VERSION') return '2.0.0';
    }),
  };

  beforeEach(() => {
    middleware = new VersionCheckMiddleware(mockConfigService as any);
  });

  it('should allow if version is supported', () => {
    const req = { headers: { 'x-app-version': '1.1.0' } };
    const res = { setHeader: jest.fn() };
    expect(() => middleware.use(req, res, jest.fn())).not.toThrow();
  });

  it('should throw if version is below minimum', () => {
    const req = { headers: { 'x-app-version': '0.9.0' } };
    const res = {};
    expect(() => middleware.use(req, res, jest.fn())).toThrow(HttpException);
  });

  it('should set x-recommend-version header', () => {
    const req = { headers: { 'x-app-version': '1.1.0' } };
    const res = { setHeader: jest.fn() };
    middleware.use(req, res, jest.fn());
    expect(res.setHeader).toHaveBeenCalledWith('x-recommend-version', '2.0.0');
  });

  it('should allow if header is not provided', () => {
    const req = { headers: {} };
    const res = { setHeader: jest.fn() };
    expect(() => middleware.use(req, res, jest.fn())).not.toThrow();
    expect(res.setHeader).toHaveBeenCalledWith('x-recommend-version', '2.0.0');
  });
});
