import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { TITLE_RU } from '../../+constants/ru.constants';

@Injectable({providedIn: 'root'})
export class CustomTitleMetaService {
    private count = 0;
    private title: string = TITLE_RU;
    constructor(private titleService: Title,
        private meta: Meta) { }

    public addCount(newCount: number): void {
        this.count += newCount;
        this.updateTitle();
    }

    public removeCount(newCount: number): void {
        this.count -= newCount;
        this.updateTitle();
    }

    public setTitle(newTitle: string): void {
        this.title = newTitle;
        this.updateTitle();
    }

    public updateDescriptionMetaTag(content: string) {
        this.meta.updateTag({ name: 'description', content: content });
        this.meta.updateTag({ property: 'og:description', content: content });
    }

    public updateKeywordsMetaTag(content: string) {
        this.meta.updateTag({ name: 'keywords', content: content });
    }

    public updateTypeMetaTag(content: string) {
        this.meta.updateTag({ property: 'og:type', content: content });
    }

    public updateOgImageMetaTag(content: string) {
        this.meta.updateTag({ property: 'og:image', content: content });
    }

    private updateTitle(): void {
        if (this.count !== 0) {
            this.titleService.setTitle(`(${this.count}) ${this.title}`);
        } else {
            this.titleService.setTitle(this.title);
        }
        this.meta.updateTag({ property: 'og:title', content: this.title });
    }
}
