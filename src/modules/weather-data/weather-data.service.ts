import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarsWeatherEntity } from './entities/mars-weather.entity';
import { NasaApiService } from '../nasa-api/nasa-api.service';
import { NasaWeatherData } from '../../shared/interfaces/nasa-weather.interface';

@Injectable()
export class WeatherDataService {
  constructor(
    @InjectRepository(MarsWeatherEntity)
    private readonly weatherRepository: Repository<MarsWeatherEntity>,
    private readonly nasaApiService: NasaApiService,
  ) {}

  async fetchAndSaveWeatherData(): Promise<MarsWeatherEntity[]> {
    const nasaData = await this.nasaApiService.fetchMarsWeatherData();
    const weatherRecords: MarsWeatherEntity[] = [];

    if (nasaData.sol_keys) {
      for (const solKey of nasaData.sol_keys) {
        const solData = nasaData[solKey];
        if (solData && typeof solData === 'object') {
          const weatherEntity = new MarsWeatherEntity();
          weatherEntity.sol = parseInt(solKey);
          
          // Datos de temperatura (en Celsius)
          weatherEntity.averageTemperature = solData.AT?.av;
          weatherEntity.minTemperature = solData.AT?.mn;
          weatherEntity.maxTemperature = solData.AT?.mx;
          weatherEntity.temperatureSamples = solData.AT?.ct;
          
          // Datos de presión (en Pascales)
          weatherEntity.pressure = solData.PRE?.av;
          weatherEntity.pressureSamples = solData.PRE?.ct;
          
          // Datos de velocidad de viento (en m/s)
          weatherEntity.windSpeed = solData.HWS?.av;
          weatherEntity.windSpeedSamples = solData.HWS?.ct;
          
          // Datos de dirección de viento
          if (solData.WD?.most_common) {
            weatherEntity.windDirection = solData.WD.most_common.compass_point;
            weatherEntity.windDirectionDegrees = solData.WD.most_common.compass_degrees;
          }
          
          // Metadatos temporales
          weatherEntity.season = solData.Season;
          weatherEntity.earthDate = solData.First_UTC ? new Date(solData.First_UTC) : null;
          weatherEntity.lastUpdate = solData.Last_UTC ? new Date(solData.Last_UTC) : null;
          
          // Validez de los datos (basado en validity_checks si están disponibles)
          const validityChecks = nasaData.validity_checks?.[solKey];
          if (validityChecks) {
            weatherEntity.isTemperatureValid = validityChecks.AT?.valid ?? true;
            weatherEntity.isPressureValid = validityChecks.PRE?.valid ?? true;
            weatherEntity.isWindSpeedValid = validityChecks.HWS?.valid ?? true;
            weatherEntity.isWindDirectionValid = validityChecks.WD?.valid ?? true;
          }

          const existingRecord = await this.weatherRepository.findOne({
            where: { sol: weatherEntity.sol }
          });

          if (!existingRecord) {
            const savedRecord = await this.weatherRepository.save(weatherEntity);
            weatherRecords.push(savedRecord);
          }
        }
      }
    }

    return weatherRecords;
  }

  async getAllWeatherData(limit: number = 10, offset: number = 0): Promise<MarsWeatherEntity[]> {
    return this.weatherRepository.find({
      order: { sol: 'DESC' },
      take: limit,
      skip: offset,
    });
  }

  async getWeatherBySol(sol: number): Promise<MarsWeatherEntity> {
    return this.weatherRepository.findOne({ where: { sol } });
  }


}
