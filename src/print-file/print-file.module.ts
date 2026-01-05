import { Module } from '@nestjs/common';
import { PrintFileService } from './print-file.service';

@Module({
  providers: [PrintFileService],
  exports: [PrintFileService],
})
export class PrintFileModule {}
