import { Controller, Post } from '@nestjs/common';
import { NasaApiService } from './nasa-api.service';

@Controller('nasa-api')
export class NasaApiController {
  constructor(private readonly nasaApiService: NasaApiService) {}

  @Post('fetch')
  async fetchMarsWeatherData() {
    const data = await this.nasaApiService.fetchMarsWeatherData();
    return {
      success: true,
      message: 'Datos del clima de Marte obtenidos exitosamente',
      data,
    };
  }
}
