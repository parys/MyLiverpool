import { PollAnswer } from './pollAnswer.model';

export class Poll {
    id = 0;

    answers: PollAnswer[] = new Array<PollAnswer>();

    question: string;

    startTime: Date = new Date();

    endTime: Date;

    voteCount: number;
}
