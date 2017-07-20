export class Material {
    public id: number;
    public title: string;
    public categoryId: number;
    public categoryName: string;
    public additionTime: Date;
    public commentsCount: number;
    public userId: number;
    public userName: string;
    public brief: string;
    public message: string;
    public reads: number;
    public source: string;
    public photo: string;
    public pending: boolean;
    public onTop: boolean;
    public canCommentary: boolean;
    public type: number;
    
    public nextMaterialId : number;

    public nextMaterialTitle: string;

    public prevMaterialId: number;

    public prevMaterialTitle: string;
}