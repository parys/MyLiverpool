import { ForumTheme }  from "../forumTheme/index";
import { Pageable } from "../../shared/index";

export class ForumSubsection {
    id: number;
    name: string;
    description: string;
    sectionId: number;
    themes: Pageable<ForumTheme>;
    themesCount: number;
}