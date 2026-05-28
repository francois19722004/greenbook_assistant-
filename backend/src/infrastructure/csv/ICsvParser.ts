export type CsvRow = string[];

export interface ICsvParser {
  parse(text: string): CsvRow[];
}
