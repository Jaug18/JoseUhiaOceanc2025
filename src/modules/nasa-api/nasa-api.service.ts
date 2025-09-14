import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { NasaWeatherData } from '../../shared/interfaces/nasa-weather.interface';

@Injectable()
export class NasaApiService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async fetchMarsWeatherData(): Promise<NasaWeatherData> {
    try {
      const apiKey = this.configService.get('NASA_API_KEY');
      const baseUrl = this.configService.get('NASA_BASE_URL') || 'https://api.nasa.gov';
      
      const url = `${baseUrl}/insight_weather/?api_key=${apiKey}&feedtype=json&ver=1.0`;
      
      const response = await firstValueFrom(
        this.httpService.get<NasaWeatherData>(url)
      );
      
      return response.data;
    } catch (error) {
      console.error('Error obteniendo datos del clima de Marte desde NASA:', error);
      throw new Error('Error al obtener datos del clima de Marte desde la API de NASA');
    }
  }
}
