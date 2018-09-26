import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
    CanDeactivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from "@angular/router";

import { MaterialEditComponent } from "../material-edit.component";

@Injectable()
export class MaterialLeaveGuard implements CanDeactivate<MaterialEditComponent> {
    canDeactivate(
        component: MaterialEditComponent,
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | boolean {

        // or, you can also handle the guard asynchronously, e.g.
        // asking the user for confirmation.
        return component.showLeaveModal();
    }
}