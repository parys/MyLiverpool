export interface IRoles {
    isLogined: boolean;
    isEditor: boolean;
    isNewsmaker: boolean;
    isModerator: boolean;
    isMainModerator: boolean;
    isAdminAssistant: boolean;
    isAdmin: boolean;
    isAuthor: boolean;
    isInformer: boolean;
    isMainInformer: boolean;
    isSelf(userId: number): boolean;
}