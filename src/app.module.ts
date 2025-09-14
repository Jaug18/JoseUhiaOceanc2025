import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { NasaApiModule } from './modules/nasa-api/nasa-api.module';
import { WeatherDataModule } from './modules/weather-data/weather-data.module';
import { AiAssistantModule } from './modules/ai-assistant/ai-assistant.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    NasaApiModule,
    WeatherDataModule,
    AiAssistantModule,
  ],
})
export class AppModule {}
