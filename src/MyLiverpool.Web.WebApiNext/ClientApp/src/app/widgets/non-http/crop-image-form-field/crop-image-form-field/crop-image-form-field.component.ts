import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'crop-image-field',
    templateUrl: './crop-image-form-field.component.html',
    styleUrls: ['./crop-image-form-field.component.scss']
})
export class CropImageFormFieldComponent {
    @Input()
    public controlName: string;
    @Output()
    public cropped: EventEmitter<string> = new EventEmitter<string>();
    public imageChangedEvent: any = '';
    public croppedImage: any;

    constructor() {}

    public onUploadImage(event: any): void  {
        this.imageChangedEvent = event;
    }

    public imageCropped(image: string): void  {
        this.croppedImage = image;
    }

    public crop(): void {
        this.cropped.emit(this.croppedImage.base64);
    }
}
