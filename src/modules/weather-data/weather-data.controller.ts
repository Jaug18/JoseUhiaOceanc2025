import { Controller, Get, Post, Query, Param, BadRequestException } from '@nestjs/common';
import { WeatherDataService } from './weather-data.service';

@Controller('weather-data')
export class WeatherDataController {
  constructor(private readonly weatherDataService: WeatherDataService) {}

  @Post('fetch-and-save')
  async fetchAndSaveWeatherData() {
    const savedRecords = await this.weatherDataService.fetchAndSaveWeatherData();
    return {
      success: true,
      message: `Se guardaron exitosamente ${savedRecords.length} registros meteorológicos`,
      data: savedRecords,
    };
  }

  @Get()
  async getAllWeatherData(
    @Query('limit') limitParam?: string,
    @Query('offset') offsetParam?: string
  ) {
    // Validar y convertir limit
    let limit = 10; // valor por defecto
    if (limitParam !== undefined) {
      const parsedLimit = parseInt(limitParam, 10);
      if (isNaN(parsedLimit)) {
        throw new BadRequestException('El parámetro limit debe ser un número válido');
      }
      if (parsedLimit < 0) {
        throw new BadRequestException('El parámetro limit debe ser un número positivo');
      }
      if (parsedLimit > 1000) {
        throw new BadRequestException('El parámetro limit no puede ser mayor a 1000');
      }
      limit = parsedLimit;
    }

    // Validar y convertir offset
    let offset = 0; // valor por defecto
    if (offsetParam !== undefined) {
      const parsedOffset = parseInt(offsetParam, 10);
      if (isNaN(parsedOffset)) {
        throw new BadRequestException('El parámetro offset debe ser un número válido');
      }
      if (parsedOffset < 0) {
        throw new BadRequestException('El parámetro offset debe ser un número positivo o cero');
      }
      offset = parsedOffset;
    }

    const data = await this.weatherDataService.getAllWeatherData(limit, offset);
    return {
      success: true,
      message: 'Datos meteorológicos obtenidos exitosamente',
      data,
    };
  }

  @Get(':sol')
  async getWeatherBySol(@Param('sol') solParam: string) {
    // Validar que el parámetro sol sea un número válido
    const sol = parseInt(solParam, 10);
    if (isNaN(sol)) {
      throw new BadRequestException('El parámetro sol debe ser un número válido');
    }
    if (sol < 0) {
      throw new BadRequestException('El parámetro sol debe ser un número positivo');
    }

    const data = await this.weatherDataService.getWeatherBySol(sol);
    return {
      success: true,
      message: data ? 'Datos meteorológicos encontrados' : 'No se encontraron datos para este Sol',
      data,
    };
  }
}
