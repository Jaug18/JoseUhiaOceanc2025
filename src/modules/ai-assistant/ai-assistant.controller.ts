import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AiAssistantService } from './ai-assistant.service';

@Controller('ai-assistant')
export class AiAssistantController {
  constructor(private readonly aiAssistantService: AiAssistantService) {}

  @Post('ask')
  async askQuestion(@Body('question') question: string) {
    // Validación de entrada
    if (!question) {
      throw new BadRequestException('La pregunta no puede estar vacía');
    }

    if (typeof question !== 'string') {
      throw new BadRequestException('La pregunta debe ser una cadena de texto válida');
    }

    if (question.trim().length === 0) {
      throw new BadRequestException('La pregunta no puede estar vacía');
    }

    if (question.length > 1000) {
      throw new BadRequestException('La pregunta es demasiado larga (máximo 1000 caracteres)');
    }

    const response = await this.aiAssistantService.askQuestion(question.trim());
    return {
      success: response.success,
      message: response.success ? 'Pregunta procesada exitosamente' : 'Error al procesar la pregunta',
      data: {
        question: question.trim(),
        answer: response.answer,
        error: response.error,
      },
    };
  }
}
