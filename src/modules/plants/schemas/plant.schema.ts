import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"

@Schema()
export class Plant {
    @Prop()
    name: string;
    
    @Prop()
    state: string;
    
    @Prop()
    annualNetGeneration: number;

    @Prop()
    coordinates: number[];

    @Prop()
    year: number;
}

export type PlantDocument = Plant & Document; 
export const PlantSchema = SchemaFactory.createForClass(Plant);
