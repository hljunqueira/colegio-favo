import { Controller, Get, Put, Post, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';
import { SiteConfigService } from './site-config.service';

const getUploadsDestination = () => {
  const uploadsPath = process.env.NODE_ENV === 'production'
    ? '/app/uploads'
    : join(__dirname, '..', '..', '..', 'uploads');
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
  }
  return uploadsPath;
};

@Controller('site-config')
export class SiteConfigController {
  constructor(private readonly service: SiteConfigService) {}

  @Get()
  async getCMSData() {
    return this.service.getCMSData();
  }

  @Put()
  async updateCMSData(@Body() body: any) {
    return this.service.updateCMSData(body);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, getUploadsDestination());
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    }),
  )
  uploadFile(@UploadedFile() file: any) {
    const fileUrl = `/favo-api/uploads/${file.filename}`;
    return { url: fileUrl };
  }
}
