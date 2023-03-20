import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { Media } from './entities/media.entity';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

import * as path from 'path';
import { CloudinaryService } from './cloudinary/cloudinary.service';

export const storage = {
  storage: diskStorage({
    filename: (req, file, cb) => {
      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;
      console.log(filename);

      cb(null, `${filename}${extension}`);
    },
  }),
};

@Controller('media')
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
    private cloudinary: CloudinaryService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createMediaDto: Media,
    @UploadedFile() file: Express.Multer.File,
  ) {
    let filename: string =
      path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
    const extension: string = path.parse(file.originalname).ext;
    filename += extension;
    createMediaDto.originalname = filename;
    const upload = await this.cloudinary.uploadFile(file);
    if (!upload) {
      return {
        status: 'error',
        message: 'An error occured while uploading image',
      };
    }
    createMediaDto.url = upload.secure_url;
    createMediaDto.status = 'active';
    const media = await this.mediaService.createMedia(createMediaDto);
    if (!media) {
      return {
        status: 'error',
        message: 'An error occured while uploading image',
      };
    }
    return {
      status: 'success',
      message: 'Media created successfully!',
      data: media,
    };
  }

  @Get()
  async findAll(@Query() query) {
    const { page = 1, perPage = 10 } = query;
    const { data, totalCount } = await this.mediaService.getPaginatedMedia(
      parseInt(page),
      parseInt(perPage),
    );

    return {
      status: 'success',
      messsage: 'Media fetced successfully!',
      data: {
        media: data,
        totalCount,
      },
    };
  }

  @Get('search')
  async searchMedia(@Query() query) {
    const { search } = query;
    const media = await this.mediaService.searchMedia(search);
    return {
      status: 'success',
      message: 'Meda fetched successfully!',
      data: media,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const media = await this.mediaService.getMediaById(id);
    if (media) throw new Error('something went wrong');
    return {
      status: 'success',
      data: media,
    };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMediaDto: string) {
    return this.mediaService.updateMediaStatus(id, updateMediaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mediaService.deleteMedia(id);
  }
}
