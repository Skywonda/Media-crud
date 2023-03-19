import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { PrismaService } from 'src/prisma.service';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  controllers: [MediaController],
  providers: [MediaService, PrismaService],
  imports: [CloudinaryModule],
})
export class MediaModule {}
