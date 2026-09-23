import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import { Transport } from '@nestjs/microservices'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { RpcExceptionFilter } from './shared/filters/rpc-exception.filter'

import { AppModule } from './app.module'

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)
  const { httpAdapter } = app.get(HttpAdapterHost)

  app.connectMicroservice({
    options: {
      host: configService.get<string>('REDIS_HOST')!,
      port: configService.get<number>('REDIS_PORT')!
    },
    transport: Transport.REDIS
  })
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true
    })
  )
  app.useGlobalFilters(new RpcExceptionFilter(httpAdapter))

  const config = new DocumentBuilder()
    .setTitle('Users API')
    .setDescription('User management and auth')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('swagger', app, document)

  await app.startAllMicroservices()
  await app.listen(configService.get('PORT')!)
}
void bootstrap()
