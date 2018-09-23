import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpWrapper } from "@app/+httpWrapper";
import { ForumSection } from "./forumSection.model";
import { FORUM_SECTIONS_ROUTE } from "@app/+constants";

@Injectable()
export class ForumSectionService {
    private actionUrl: string;

    constructor(private http: HttpWrapper) {
        this.actionUrl = FORUM_SECTIONS_ROUTE + "/";
    }

    public getAll(): Observable<ForumSection[]> {
        return this.http.get<ForumSection[]>(this.actionUrl);
    };

    // public GetSingle = (id: number): Observable<News> => {
    //    return this.http.get(this.actionUrl + id).map(res => res.json());
    // };

  //  create = (item: ForumSection): Observable<Signup> => {
  //      return this.http.post(this.actionUrl + "register/", JSON.stringify(item)).map(res => res.json());
 //   };
}