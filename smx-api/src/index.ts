import server from './configs/express'
import { config } from './configs/config'
import { AppDataSource } from './configs/database'

import { PostgresDriver } from 'typeorm/driver/postgres/PostgresDriver'

// 🧩 Final patch to support "vector"
const originalNormalizeType = PostgresDriver.prototype.normalizeType
;(PostgresDriver.prototype as any).normalizeType = function (column: any) {
  if (column.type === 'vector') return 'vector'
  return originalNormalizeType.call(this, column)
}

const PORT = config.port

// Connect to PostgreSQL
AppDataSource.initialize()
  .then(() => {
    console.log('✅ Database connected successfully!')
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`)
    })
  })
  .catch((error) => {
    console.error('❌ Database connection failed!', error)
  })
