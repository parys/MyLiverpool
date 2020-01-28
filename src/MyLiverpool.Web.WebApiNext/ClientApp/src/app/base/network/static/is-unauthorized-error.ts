import { HttpErrorResponse } from '@angular/common/http';

import { HttpStatusCode } from '@network/enums';


export function isUnauthorizedError(error: HttpErrorResponse): boolean {
    return error instanceof HttpErrorResponse && error.status === HttpStatusCode.UNAUTHORIZED;
}
