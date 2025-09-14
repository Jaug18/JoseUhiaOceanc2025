import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeatherDataController } from './weather-data.controller';
import { WeatherDataService } from './weather-data.service';
import { MarsWeatherEntity } from './entities/mars-weather.entity';
import { NasaApiModule } from '../nasa-api/nasa-api.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MarsWeatherEntity]),
    NasaApiModule,
  ],
  controllers: [WeatherDataController],
  providers: [WeatherDataService],
  exports: [WeatherDataService],
})
export class WeatherDataModule {}
