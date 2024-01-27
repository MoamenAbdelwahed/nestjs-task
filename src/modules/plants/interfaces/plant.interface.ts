import * as mongoose from 'mongoose';

export interface IPlant extends mongoose.Document{
    id?: number;
    name: string;
    state: string;
    annualNetGeneration: number;
    coordinates: number[];
    year: number;
}