import { Statistics } from "./statistics.model";

export class PersonStatistics {
    public personId: number;

    public personName: string;

    public goals: Statistics[];

    public assists: Statistics[];

    public yellows: Statistics[];

    public reds: Statistics[];
}