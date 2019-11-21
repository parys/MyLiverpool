import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImageService } from '../image.service';

@Component({
    selector: 'image-crop-addition',
    templateUrl: './image-crop-addition.component.html',
    styleUrls: ['./image-crop-addition.component.scss']
})
export class ImageCropAdditionComponent {
    @Input()
    public controlName = 'upload-crop-image';
    @Output()
    public loadedImage: EventEmitter<string> = new EventEmitter<string>();
    public imageChangedEvent: any = '';
    public croppedImage: any = '';

    constructor(private service: ImageService,
                private snackBar: MatSnackBar
    ) {}

    public onUploadImage(event: any): void  {
        this.imageChangedEvent = event;
    }

    public imageCropped(image: string): void  {
        this.croppedImage = image;
    }

    public crop(): void {
        this.service.uploadBase64Image(this.croppedImage.base64)
            .subscribe(result => {
                this.loadedImage.emit(result);
                this.snackBar.open('Изображение обрезано');
                this.imageChangedEvent = this.croppedImage = null;
                },
                error => {
                    this.snackBar.open('Ошибка при загрузке', null);
                });
    }
}
