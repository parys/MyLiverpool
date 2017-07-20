import { ForumMessage } from "../forumMessage/index";
import { Pageable } from "../../shared/index";

export class ForumTheme {
    id: number;
    subsectionId: number;
    //   virtual ForumSubsection Subsection: F;
    isPool: boolean;
    onTop: boolean;
    lastMessageAdditionTime: Date;
    isClosed: boolean;
    answers: number;
    views: number;
    name: string;
    description: string;
    authorUserName: string;
    authorId: number;
    //    virtual User LastAnswerUser: ;
    lastAnswerUserId: number;
    messages: Pageable<ForumMessage>;
}