import { Controller, Get, Post, UploadedFile, Res, HttpStatus, UseInterceptors, Query } from '@nestjs/common';
import { PlantsService } from '../services/plants.service';
import { Workbook } from 'exceljs';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('plants')
export class PlantsController {
  constructor(private readonly plantsService: PlantsService) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        cb(null, './uploads/');
      },
      filename: (req, file, cb) => {
        cb(null, file.originalname);
      },
    }),
  }))
  async createPlants(@UploadedFile() file: Express.Multer.File, @Res() res) {
    try {
      
      const workbook = new Workbook();
      await workbook.xlsx.readFile(file.path);

      const plantSheetName = workbook.worksheets.find((s) => s.name.startsWith('PLN'))?.name;
      const plantSheet = workbook.getWorksheet(plantSheetName);
      if (!plantSheet) {
        throw new Error('Sheet with name starting with "PLN" not found');
      }

      const rowCount = plantSheet.rowCount;
      const plantData = plantSheet.getRows(3, rowCount).map((row) => {
        try {
          const name = row.getCell(4)?.value?.toString() || "";
          const state = row.getCell(3)?.value?.toString() || "";
          const year = Number(row.getCell(2)?.value?.toString()) || null; // Allow null for missing years
          const coordinates = [
            !isNaN(parseFloat(row.getCell(20)?.value?.toString()))
              ? parseFloat(row.getCell(20)?.value?.toString())
              : null,
            !isNaN(parseFloat(row.getCell(21)?.value?.toString()))
              ? parseFloat(row.getCell(21)?.value?.toString())
              : null,
          ];
          const annualNetGeneration = Number(row.getCell(111)?.value?.toString()) || 0; // Handle missing or invalid values
      
          return { name, state, year, coordinates, annualNetGeneration };
        } catch (error) {
          console.error("Error processing row:", error);
        }
      });

      await this.plantsService.createPlants(plantData);

      res.status(HttpStatus.OK).json({ message: 'Plants data imported successfully' });
    } catch (error) {
      console.error(error);
      res.status(HttpStatus.BAD_REQUEST).json({ message: 'Failed to import plants data' });
    }
  }

  @Get()
  async getAllPlants(@Query('state') targetState?: string) {
    return await this.plantsService.getAllPlants(targetState);
  }

  @Get('/top')
  async getTopPlants(@Query('limit') limit?: number) {
    return await this.plantsService.getTopPlants(limit);
  }
}