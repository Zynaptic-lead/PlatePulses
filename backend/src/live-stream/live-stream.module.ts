import { Module } from '@nestjs/common';
import { LiveStreamService } from './live-stream.service';
import { LiveStreamController } from './live-stream.controller';

@Module({
  providers: [LiveStreamService],
  controllers: [LiveStreamController],
  exports: [LiveStreamService],
})
export class LiveStreamModule {}
