export class Comment {
    public id: number;
    public additionTime: Date;
    public lastModified: Date;
    public authorUserName: string;
    public authorId: number;
    public photo: string;
    public message: string;
    public answer: string;
    public materialId: number;
    public children: Comment[];
    public isVerified: boolean;
    public parentId: number;
    public number: number;
    public canPositiveVote: boolean;
    public canNegativeVote: boolean;
    public positiveCount: number;
    public negativeCount: number;
    public type: number;
    public typeName: string;
    public matchId: number;
}
