import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
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

  async getAll(): Promise<IPlant[]> {
    return await this.plantModel.find().exec();
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