import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { NasaApiController } from './nasa-api.controller';
import { NasaApiService } from './nasa-api.service';

@Module({
  imports: [HttpModule],
  controllers: [NasaApiController],
  providers: [NasaApiService],
  exports: [NasaApiService],
})
export class NasaApiModule {}
