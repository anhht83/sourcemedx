export enum EReportType {
  long_list = 'long_list',
  short_list = 'short_list',
}

export const EReportTypeLabel = new Map<EReportType, string>([
  [EReportType.long_list, 'Long List'],
  [EReportType.short_list, 'Short List'],
])
