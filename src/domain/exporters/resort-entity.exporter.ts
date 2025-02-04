export interface ResortEntityExporter {
  export(resortId: string): Promise<string>;
}
