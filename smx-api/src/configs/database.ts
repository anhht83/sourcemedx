import { DataSource } from 'typeorm'
import { config } from './config'
import * as Entities from '../application/entities' // Import your entity files
import { GUDIDDevice } from '../libs/gudid/gudid.entity'
import { FDARecall } from '../libs/fdaRecall/fdaRecall.entity'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.db.host,
  port: config.db.port,
  username: config.db.user,
  password: config.db.password,
  database: config.db.name,
  synchronize: false,
  // logging: config.nodeEnv === "development",
  logging: ['error', 'warn'],
  entities: [...Object.values(Entities), GUDIDDevice, FDARecall],
  migrations: [
    config.nodeEnv === 'development'
      ? 'src/migrations/*.ts'
      : 'src/migrations/*.js',
  ],
  subscribers: [],
})
