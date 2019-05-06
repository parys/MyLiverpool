import { ForumTheme }  from '../forumTheme';
import { Pageable } from '@app/shared';

export class ForumSubsection {
    id: number;
    name: string;
    description: string;
    sectionId: number;
    themes: Pageable<ForumTheme>;
    themesCount: number;
}
