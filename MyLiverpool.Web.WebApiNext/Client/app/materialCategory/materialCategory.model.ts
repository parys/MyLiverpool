import { MaterialType } from "./materialType.enum";

export class MaterialCategory {
    id: number;
    itemsCount: number;
    name: string;
    description: string;
    materialType: MaterialType;
}