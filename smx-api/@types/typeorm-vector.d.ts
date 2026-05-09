import 'typeorm'

declare module 'typeorm/driver/types/ColumnTypes' {
  interface ColumnTypes {
    vector: any
  }
}
