import { Injectable } from '@nestjs/common';
import { PlantRepository } from '../repositories/plant.repository';
import { IPlant } from '../interfaces/plant.interface';
import { Plant } from '../schemas/plant.schema';
import { CreatePlantDto } from '../dtos/create-plant.dto';

@Injectable()
export class PlantsService {
  constructor(
    private readonly plantRepository: PlantRepository
  ) {}

  async createPlants(plantsData: Plant[]): Promise<void> {
    try {
      await this.plantRepository.createPlants(plantsData);
    } catch (error) {
      console.error('Error creating plants:', error);
      throw new Error('Failed to create plants');
    }
  }
  
  async getAllPlants(targetState?: string): Promise<Plant[]> {
    return await this.plantRepository.getAll(targetState);
  }

  async getTopPlants(limit?: number): Promise<Plant[]> {
    return await this.plantRepository.getTopPlantsByOverallNetGeneration(limit);
  }
}