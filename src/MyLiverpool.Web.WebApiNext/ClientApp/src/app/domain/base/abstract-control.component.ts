import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ChangeDetectorRef, Input, forwardRef, Directive } from '@angular/core';

import { ObserverComponent } from '@domain/base/observer.component';

export function ControlValueProvider(type: any) {
    return {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => type),
        multi: true
    };
}

export abstract class AbstractControlComponent<T = any> extends ObserverComponent implements ControlValueAccessor {

    @Input() disabled: boolean;

    @Input()
    set value(value: T) {
        this._value = value;
        this.notifyValueChange();
    }

    get value(): T {
        return this._value;
    }

    onChange: (value: T) => {};

    onTouched: () => {};

    // tslint:disable-next-line:variable-name
    protected _value: T;

    constructor(protected cdRef: ChangeDetectorRef) {
        super();
    }

    protected notifyValueChange(): void {
        if (this.onChange) {
            this.onChange(this.value);
        }
    }

    public writeValue(value: T): void {
        this._value = value;
        this.cdRef.detectChanges();
    }

    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    public setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}
