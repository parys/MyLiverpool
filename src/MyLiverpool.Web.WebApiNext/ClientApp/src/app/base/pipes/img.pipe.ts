import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'img' })
export class ImgPipe implements PipeTransform {

    public transform(value: string, widths: number[]): string {
        let result = '';
        for (let index = 0; index < widths.length; index++) {
            if (index > 0) {
                result += ', ';
            }
            result += `small${widths[index]}/${value} ${widths[index]}w`;
        }

        return result;
    }
}
