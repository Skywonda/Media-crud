// media.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Media } from './entities/media.entity';

@Injectable()
export class MediaService {
  constructor(private readonly prisma: PrismaService) {}

  async createMedia(data: Media): Promise<Media> {
    const createdMedia = await this.prisma.media.create({
      data,
    });

    return createdMedia;
  }

  async getMediaById(id: string): Promise<Media | null> {
    const media = await this.prisma.media.findUnique({ where: { id } });
    return media;
  }

  async getPaginatedMedia(
    page: number,
    perPage: number,
  ): Promise<{ data: Media[]; totalCount: number }> {
    const [media, totalCount] = await Promise.all([
      this.prisma.media.findMany({
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      this.prisma.media.count(),
    ]);

    return { data: media, totalCount };
  }

  async searchMedia(query: string): Promise<Media[]> {
    const media = await this.prisma.media.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
    });

    return media;
  }

  async updateMediaStatus(id: string, status: string): Promise<Media> {
    const updatedMedia = await this.prisma.media.update({
      where: { id },
      data: { status },
    });

    return updatedMedia;
  }

  async deleteMedia(id: string): Promise<void> {
    await this.prisma.media.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
