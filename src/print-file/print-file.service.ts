import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as fsSync from 'fs';

@Injectable()
export class PrintFileService {
  private readonly uploadPath = path.join(process.cwd(), 'uploads');

  constructor(private prisma: PrismaService) {}

  async generatePrintFile(orderId: number) {
    // Implementation for generating print files
    // This would typically involve combining design elements with product templates
    // and creating final print-ready files
    return {
      success: true,
      message: `Print file generated for order ${orderId}`,
      filePath: `/uploads/print-files/order-${orderId}.pdf`,
    };
  }

  async uploadPrintFile(file: Express.Multer.File, orderId: number) {
    // Implementation for uploading print files
    return {
      success: true,
      message: `Print file uploaded for order ${orderId}`,
      filePath: `/uploads/print-files/order-${orderId}-${file.originalname}`,
    };
  }

  async generatePrintFileWithCanvas(orderItemId: number): Promise<string> {
    // 1. Ma'lumotlarni olish
    const orderItem = await this.prisma.orderItem.findUnique({
      where: { id: orderItemId },
      include: { variant: true },
    });

    if (!orderItem) {
      throw new NotFoundException(`OrderItem #${orderItemId} topilmadi`);
    }

    // Front va Back dizaynlarni tekshirish (ikkalasi ham bo'lsa, ikkita fayl yoki birlashtirish kerak)
    // Hozircha birinchisini olamiz
    const designData = (orderItem.frontDesign || orderItem.backDesign) as any;
    if (!designData || !designData.elements) {
      throw new InternalServerErrorException('Dizayn elementlari mavjud emas');
    }

    try {
      // 2. Kutubxonalarni yuklash
      const { createCanvas, loadImage } = await import('canvas');
      const { v4: uuidv4 } = await import('uuid');

      // 3. Papkani tayyorlash
      const printDir = path.join(this.uploadPath, 'print-files');
      await fs.mkdir(printDir, { recursive: true });

      const printFilename = `${uuidv4()}_print.png`;
      const printFilePath = path.join(printDir, printFilename);

      // 4. Canvas yaratish (3000x3000px)
      const canvas = createCanvas(3000, 3000);
      const ctx = canvas.getContext('2d');

      // Shaffof fon (bu muhim, chunki kiyim ustiga bosiladi)
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 5. Elementlarni chizish
      for (const element of designData.elements) {
        if (!element.assetUrl) continue;

        // Pathni to'g'irlash (Agar /uploads bilan boshlansa, process.cwd bilan birlashtirish)
        const relativePath = element.assetUrl.startsWith('/')
          ? element.assetUrl.substring(1)
          : element.assetUrl;
        const assetPath = path.join(process.cwd(), relativePath);

        if (fsSync.existsSync(assetPath)) {
          const img = await loadImage(assetPath);

          // Hisoblashlar
          const x = (element.x_percent / 100) * canvas.width;
          const y = (element.y_percent / 100) * canvas.height;
          const width = (element.width_percent / 100) * canvas.width; // 'width' emas 'width_percent' bo'lishi aniqroq
          const height = (element.height_percent / 100) * canvas.height;

          ctx.save();
          // Markaz bo'yicha transformatsiya qilish
          ctx.translate(x + width / 2, y + height / 2);
          ctx.rotate(((element.rotation || 0) * Math.PI) / 180);

          const scale = element.scale || 1;
          ctx.scale(scale, scale);

          // Rasmni chizish
          ctx.drawImage(img, -width / 2, -height / 2, width, height);
          ctx.restore();
        }
      }

      // 6. Saqlash
      const buffer = canvas.toBuffer('image/png');
      await fs.writeFile(printFilePath, buffer);

      // 7. Bazani yangilash
      const publicUrl = `/uploads/print-files/${printFilename}`;
      await this.prisma.orderItem.update({
        where: { id: orderItemId },
        data: { finalPrintFile: publicUrl },
      });

      return publicUrl;
    } catch (error) {
      console.error('Print generation error:', error);
      throw new InternalServerErrorException(
        'Bosma faylni yaratishda xatolik yuz berdi',
      );
    }
  }
}
