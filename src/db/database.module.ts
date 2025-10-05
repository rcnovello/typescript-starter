import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbConfig: any = {
          type: 'oracle',
          host: configService.get('DB_HOST'),
          port: parseInt(configService.get('DB_PORT'), 10) || 1521,
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          synchronize: configService.get('NODE_ENV') === 'development',
          logging: configService.get('NODE_ENV') === 'development',
        };

        // Usa SID ou SERVICE_NAME conforme configurado
        const sid = configService.get('DB_SID');
        const serviceName = configService.get('DB_SERVICE_NAME');
        
        if (serviceName) {
          dbConfig.serviceName = serviceName;
        } else if (sid) {
          dbConfig.sid = sid;
        }

        console.log('🔧 Configuração do banco Oracle:', {
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.username,
          serviceName: dbConfig.serviceName,
          sid: dbConfig.sid
        });

        return dbConfig;
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}