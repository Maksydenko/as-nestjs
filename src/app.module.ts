import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { TypeOrmModule } from '@nestjs/typeorm'

import { redisStore } from 'cache-manager-redis-yet'

import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'

import { THROTTLE_LIMIT_PER_MINUTE, THROTTLE_TTL_MS } from './app.consts'
import { USER_PROFILE_CACHE_TTL_MS } from './users/users.consts'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync({
      inject: [ConfigService],
      isGlobal: true,
      useFactory: async (config: ConfigService) => {
        const store = await redisStore({
          socket: {
            host: config.get('REDIS_HOST'),
            port: config.get<number>('REDIS_PORT')
          },
          ttl: USER_PROFILE_CACHE_TTL_MS
        })

        return { store }
      }
    }),
    ThrottlerModule.forRoot({
      throttlers: [{ limit: THROTTLE_LIMIT_PER_MINUTE, ttl: THROTTLE_TTL_MS }]
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        autoLoadEntities: true,
        database: config.get('DB_NAME'),
        host: config.get('DB_HOST'),
        password: config.get('DB_PASSWORD'),
        port: config.get<number>('DB_PORT'),
        synchronize: false,
        type: 'postgres',
        username: config.get('DB_USER')
      })
    }),
    AuthModule,
    UsersModule
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }]
})
export class AppModule {}
