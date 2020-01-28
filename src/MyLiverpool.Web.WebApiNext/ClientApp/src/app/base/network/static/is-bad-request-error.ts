import { HttpErrorResponse } from '@angular/common/http';

import { HttpStatusCode } from '@network/enums';


export function isBadRequestError(error: HttpErrorResponse): boolean {
    return error instanceof HttpErrorResponse && error.status === HttpStatusCode.BAD_REQUEST;
}
