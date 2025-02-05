export interface ResortDataFiller<TExportContext> {
  fill(resortId: string, context: TExportContext): Promise<void>;
}
