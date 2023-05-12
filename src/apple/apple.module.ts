import { Module } from '@nestjs/common';
import { AppleController } from './apple.controller';
import { AppleService } from './apple.service';

@Module({
  imports: [],
  controllers: [AppleController],
  providers: [AppleService],
})
export class AppleModule {}
