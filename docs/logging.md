# Logging System Guide

The API's logging system is designed for observability, debugging, and integration with external systems.

## Features

- **Console Logs**: Pretty logs with colorized output for developers.
- **File Logs**:
  - `logs/error.log`: Logs all error-level messages.
  - `logs/combined.log`: Logs all messages from info and above.
- **Structured JSON Logs**: Compatible with external systems like ELK or Datadog.
- **Request Tracing**: Includes `Request ID` and `Correlation ID` for distributed debugging.

## Log Levels

- `debug`: Detailed information for debugging during development.
- `info`: High-level application flow information.
- `warn`: Potential issues or unexpected conditions.
- `error`: Critical errors that need attention.

## Configuration

### Setting the Log Level

You can adjust the logging level using the `LOG_LEVEL` environment variable:

```bash
LOG_LEVEL=info
```

### Default Configuration

```json
{
"level": "debug",
"format": "JSON",
"transports": ["Console", "File"]
}
```

## Using the Logging Service

The Logging Service can be used to log messages from any module:

```typescript
import { Injectable } from '@nestjs/common';
import { LoggingService } from './logging/logging.service';

@Injectable()
export class ExampleService {
constructor(private readonly loggingService: LoggingService) {}

performTask() {
this.loggingService.log('Task executed successfully');
this.loggingService.error('Something went wrong', { errorCode: 500 });
}
}
```

## Accessing Logs

Logs are available:

- **Console**: Real-time logs.
- **Files**:
  - `logs/error.log`: Captures all errors.
  - `logs/combined.log`: Captures all messages.

## Integration with External Tools

Structured JSON logs make it easy to integrate with systems like:

- **Elasticsearch/Kibana (ELK)**.
- **Datadog**.
- **AWS CloudWatch**.

For future integrations, modify the Winston transport configuration.
