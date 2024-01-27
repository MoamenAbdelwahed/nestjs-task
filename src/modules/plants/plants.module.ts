import { Module } from '@nestjs/common';
import { PlantsController } from './controllers/plants.controller';
import { PlantsService } from './services/plants.service';
import { PlantRepository } from './repositories/plant.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { PlantSchema } from './schemas/plant.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Plant', schema: PlantSchema }])
  ],
  controllers: [PlantsController],
  providers: [PlantsService, PlantRepository],
  exports: [PlantsService],
})
export class PlantModule {}
