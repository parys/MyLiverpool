export class ForumMessage {
    id: number;
    themeId: number;
    //   virtual ForumTheme Theme: ;
    additionTime: Date;
    isFirstMessage: boolean;
    message: string;
    // virtual User Author: ;
    authorId: number;
    //   public string Ip: ;
    lastModifiedTime: Date;
}