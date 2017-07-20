import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { Image } from "./image.model";                          

@Component({
    selector: "image-detail",
    templateUrl: "./image-detail.component.html"
})
export class ImageDetailComponent implements OnInit, OnDestroy {
    //messageForm: FormGroup;
    //private sub: Subscription;
    //items: ChatMessage[];
    //page: number = 1;
    //itemsPerPage: number = 15;
    //totalItems: number;
    //roles: IRoles;
    @Input() item: Image; 

    constructor(//private service: ChatMessageService,
      //  private route: ActivatedRoute,
      //  private formBuilder: FormBuilder,
        //private rolesChecked: RolesCheckedService
    ) {
    }

    ngOnInit() {
       // this.roles = this.rolesChecked.checkedRoles;
      //  this.initForm();
     //   this.update();
    }

    ngOnDestroy() {
    }
}