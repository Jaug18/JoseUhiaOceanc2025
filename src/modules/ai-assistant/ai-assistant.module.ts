import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiAssistantController } from './ai-assistant.controller';
import { AiAssistantService } from './ai-assistant.service';
import { MarsWeatherEntity } from '../weather-data/entities/mars-weather.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MarsWeatherEntity])],
  controllers: [AiAssistantController],
  providers: [AiAssistantService],
})
export class AiAssistantModule {}
