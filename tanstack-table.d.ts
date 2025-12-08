/* eslint-disable @typescript-eslint/no-unused-vars */
import '@tanstack/react-table'

declare module '@tanstack/react-table' {
  // The unnecessary constraints are removed here
  interface ColumnMeta<TData, TValue> {
    className?: string
    // Export controls
    exportable?: boolean // default true
    forceExport?: boolean // force include even if no accessor
    exportLabel?: string // custom header label for export
    exportValue?: (row: TData) => unknown // custom value resolver for export
  }
}
