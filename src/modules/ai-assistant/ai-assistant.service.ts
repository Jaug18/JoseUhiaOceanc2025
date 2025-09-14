import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import OpenAI from 'openai';
import { MarsWeatherEntity } from '../weather-data/entities/mars-weather.entity';

interface AiResponse {
  answer: string;
  success: boolean;
  error?: string;
}

@Injectable()
export class AiAssistantService {
  private openaiClient: OpenAI;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(MarsWeatherEntity)
    private readonly weatherRepository: Repository<MarsWeatherEntity>,
  ) {
    // Inicializar cliente de OpenAI
    const apiKey = this.configService.get('OPENAI_API_KEY');
    if (apiKey) {
      this.openaiClient = new OpenAI({
        apiKey: apiKey,
      });
    }
  }

  async askQuestion(question: string): Promise<AiResponse> {
    try {
      const weatherContext = await this.getWeatherContext();
      const prompt = this.buildPrompt(question, weatherContext);
      
      const openaiResponse = await this.callOpenAI(prompt);
      
      return {
        success: true,
        answer: openaiResponse,
      };
    } catch (error) {
      return {
        success: false,
        answer: 'Lo siento, no pude procesar tu pregunta en este momento.',
        error: error.message,
      };
    }
  }

  private async getWeatherContext(): Promise<string> {
    const weatherData = await this.weatherRepository.find({
      order: { sol: 'DESC' },
      take: 30, // Últimos 30 registros
    });

    if (weatherData.length === 0) {
      return 'No hay datos meteorológicos de Marte disponibles.';
    }

    const context = weatherData.map(record => 
      `Sol ${record.sol}: ` +
      `Temperatura (°C): promedio ${record.averageTemperature || 'N/A'}, ` +
      `mínima ${record.minTemperature || 'N/A'}, ` +
      `máxima ${record.maxTemperature || 'N/A'} ` +
      `(${record.temperatureSamples || 0} muestras), ` +
      `Presión atmosférica: ${record.pressure || 'N/A'} Pa ` +
      `(${record.pressureSamples || 0} muestras), ` +
      `Viento: velocidad ${record.windSpeed || 'N/A'} m/s ` +
      `(${record.windSpeedSamples || 0} muestras), ` +
      `dirección ${record.windDirection || 'N/A'} ` +
      `(${record.windDirectionDegrees || 'N/A'}°), ` +
      `Estación marciana: ${record.season || 'N/A'}, ` +
      `Fecha terrestre: ${record.earthDate?.toISOString().split('T')[0] || 'N/A'}, ` +
      `Validez de datos: Temp:${record.isTemperatureValid ? 'Sí' : 'No'}, ` +
      `Presión:${record.isPressureValid ? 'Sí' : 'No'}, ` +
      `Viento:${record.isWindSpeedValid ? 'Sí' : 'No'}`
    ).join('\n');

    return context;
  }

  private buildPrompt(question: string, weatherContext: string): string {
    return `Eres un asistente experto en datos meteorológicos de Marte de la misión InSight de la NASA. 
Tienes acceso a los siguientes datos meteorológicos reales del planeta Marte en Elysium Planitia:

INFORMACIÓN CONTEXTUAL:
- Los datos son de la misión InSight de la NASA (octubre 2020)
- Las temperaturas están en grados Celsius
- La presión está en Pascales
- La velocidad del viento está en metros por segundo
- Las direcciones del viento usan puntos cardinales: N(Norte), NE(Noreste), E(Este), SE(Sureste), S(Sur), SW(Suroeste), W(Oeste), NW(Noroeste), WNW(Oeste-Noroeste), etc.
- Un Sol es un día marciano (24 horas 37 minutos)

DATOS METEOROLÓGICOS DE MARTE:
${weatherContext}

PREGUNTA DEL USUARIO: ${question}

Por favor, responde la pregunta del usuario basándote en los datos proporcionados. 
Si los datos no contienen información suficiente para responder la pregunta, menciona que no tienes suficiente información.
Responde en español de manera clara y precisa.
Incluye datos específicos cuando sea posible (números de Sol, temperaturas exactas, fechas, direcciones, etc.).`;
  }

  private async callOpenAI(prompt: string): Promise<string> {
    try {
      if (!this.openaiClient) {
        throw new Error('Clave de API de OpenAI no configurada');
      }

      const completion = await this.openaiClient.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      });

      const response = completion.choices?.[0]?.message?.content;
      
      if (!response) {
        throw new Error('Respuesta inválida de la API de OpenAI');
      }

      return response;
    } catch (error) {
      console.error('Error llamando a la API de OpenAI:', error);
      throw new Error('Error al obtener respuesta del asistente de IA');
    }
  }
}
