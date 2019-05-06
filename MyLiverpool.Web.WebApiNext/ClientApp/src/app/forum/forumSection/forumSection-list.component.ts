import { Component, OnInit } from '@angular/core';
import { ForumSectionService } from './forumSection.service';
import { ForumSection } from './forumSection.model';
import { RolesCheckedService } from '@app/+auth';

@Component({
    selector: 'forumSection-list',
    templateUrl: './forumSection-list.component.html'
})

export class ForumSectionListComponent implements OnInit {

    items: ForumSection[];

    constructor(private service: ForumSectionService, public roles: RolesCheckedService) {
    }

    public ngOnInit(): void {
        this.service
            .getAll()
            .subscribe(data => this.items = data,
            error => console.log(error));
    }
}
