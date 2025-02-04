import { ResortEntityExporter } from '../../domain/exporters/resort-entity.exporter';
import { ExportResortHandler } from './export-resort.handler';
import { ExportResortQuery } from './export-resort.query';

describe('ExportResortHandler', () => {
  let handler: ExportResortHandler;
  let mockExporter: jest.Mocked<ResortEntityExporter>;

  beforeEach(() => {
    mockExporter = {
      export: jest.fn(),
    } as unknown as jest.Mocked<ResortEntityExporter>;

    handler = new ExportResortHandler(mockExporter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should export resort data when a valid resortId is provided', async () => {
    const resortId = '5f905dac-b03e-4932-a53e-f20f55661c3c';
    const exportData = 'path/to/database.sql';
    mockExporter.export.mockResolvedValue(exportData);
    const query = new ExportResortQuery(resortId);

    const result = await handler.handle(query);

    expect(result).toEqual(exportData);
    expect(mockExporter.export).toHaveBeenCalledWith(resortId);
    expect(mockExporter.export).toHaveBeenCalledTimes(1);
  });
});
