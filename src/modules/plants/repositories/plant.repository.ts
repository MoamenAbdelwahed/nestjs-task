import { Injectable } from '@nestjs/common';
import { Model, PipelineStage } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IPlant } from '../interfaces/plant.interface';
import { CreatePlantDto } from '../dtos/create-plant.dto';
import { Plant, PlantDocument } from '../schemas/plant.schema';

@Injectable()
export class PlantRepository {
  constructor(@InjectModel(Plant.name) private readonly plantModel: Model<PlantDocument>) {}

  async create(plant: CreatePlantDto): Promise<IPlant> {
    const newPlant = new this.plantModel(plant);
    return await newPlant.save();
  }
  async createPlants(plantsData: Plant[]): Promise<IPlant[]> {
    return await this.plantModel.insertMany(plantsData);
  }

  async getAll(targetState?: string): Promise<IPlant[]> {
    const pipeline: PipelineStage[] = [
        {
            $group: {
                _id: '$state',
                stats: {
                    $sum: '$annualNetGeneration',
                },
                totalPlants: { $sum: 1 },
                allPlantsGeneration: { $sum: '$annualNetGeneration' },
                plants: { $push: {
                    name: '$name',
                    annualNetGeneration: '$annualNetGeneration',
                    coordinates: '$coordinates'
                } },
            },
        },
        {
            $sort: { state: 1 }
        },
        {
            $project: {
                _id: '$_id',
                state: '$_id',
                annualNetGenerationTotal: '$stats.sum',
                totalPlants: '$totalPlants',
                overallNetGeneration: '$allPlantsGeneration',
                plants: 1,
            },
        },
    ];
    if (targetState) {
        pipeline.unshift({ $match: { state: targetState } });
    }
    const data = await this.plantModel.aggregate(pipeline);
    
    let allNetGenerations: number = 0;
    data.forEach(async (plant) => {
        allNetGenerations += plant.overallNetGeneration
    });
    data.forEach(async (plant) => {
        plant.overallNetGenerationPercentage = plant.overallNetGeneration / allNetGenerations * 100;
    });
    return data;
  }
  
  async calculatePercentage(plantData: any, overallNetGeneration: number): Promise<number> {
    const allPlantsGeneration = plantData.allPlantsGeneration || 0;
    return (100 * allPlantsGeneration) / overallNetGeneration;
  }
  
  async getTopPlantsByOverallNetGeneration(limit?: number): Promise<Plant[]> {
    const pipeline: PipelineStage[] = [
      { $sort: { annualNetGeneration: -1 } }
    ];

    if (limit) {
      pipeline.push({ $limit: limit });
    }

    const topPlants = await this.plantModel.aggregate(pipeline);
    return topPlants;
  }

  async getById(id: string): Promise<IPlant | null> {
    return await this.plantModel.findById(id).exec();
  }

  async updateById(id: string, plant: Partial<IPlant>): Promise<IPlant | null> {
    return await this.plantModel.findByIdAndUpdate(id, plant, { new: true }).exec();
  }

  async deleteById(id: string): Promise<void> {
    await this.plantModel.findByIdAndDelete(id).exec();
  }
}