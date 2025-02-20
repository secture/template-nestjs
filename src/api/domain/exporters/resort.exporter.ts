export interface ResortExporter {
  export(resortId: string): Promise<string>;
}
