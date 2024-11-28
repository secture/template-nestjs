import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { ClsService } from 'nestjs-cls';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  constructor(private readonly clsService: ClsService) {}

  use(req: Request, res: Response, next: NextFunction) {
    this.clsService.run(() => {
      const requestId = uuidv4();
      const correlationId = req.headers['x-correlation-id'] || uuidv4();

      this.clsService.set('requestId', requestId);
      this.clsService.set('correlationId', correlationId);
      this.clsService.set('clientIp', req.ip);
      this.clsService.set('userAgent', req.headers['user-agent']);
      this.clsService.set('url', req.originalUrl);

      res.setHeader('x-request-id', requestId);
      res.setHeader('x-correlation-id', correlationId);

      next();
    });
  }
}
