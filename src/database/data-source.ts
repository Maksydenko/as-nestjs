import { DataSource } from 'typeorm'

import { User } from '../users/entities/user.entity'

import 'dotenv/config'

export default new DataSource({
  database: process.env.DB_NAME,
  entities: [User],
  host: process.env.DB_HOST,
  migrations: ['src/database/migrations/*.ts'],
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  synchronize: false,
  type: 'postgres',
  username: process.env.DB_USER
})
