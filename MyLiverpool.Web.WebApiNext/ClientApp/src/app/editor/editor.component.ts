import { Component, forwardRef, Input, NgZone, AfterViewInit, OnDestroy, ChangeDetectionStrategy } from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";
import { Observable, ReplaySubject } from "rxjs";
//import { Editor, Settings } from "tinymce";
import { LazyLoadingLibraryService } from "./lazyLoadingLibrary.service";

declare let tinymce: any;

@Component({
    selector: "bbeditor",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => EditorComponent),
            multi: true
        }],
    styleUrls: ["./editor.component.scss"],
    template: `<textarea id="{{elementId}}"></textarea>`,
    changeDetection: ChangeDetectionStrategy.OnPush
    
})

export class EditorComponent implements AfterViewInit, ControlValueAccessor, OnDestroy  {
    @Input("value") public _value: string = "";
    @Input() public type: number = 1;
    @Input() public height: number = 200;
    public elementId: string = Math.random().toString(36).substring(2);
    private elementLoaded: ReplaySubject<any> = new ReplaySubject<any>();
    //   public tinymce: EditorManager = new EditorManager();
    private editor: any;//Editor;
    //  @ViewChild("nativeElement") public nativeElement: ElementRef;

    constructor(
        private lazyService: LazyLoadingLibraryService,
        private zone: NgZone) {
       // console.warn("tiny ctor " + this.elementId);
        //if (!this.isTinyDefined()) {
        //    console.warn("tiny ctor-2 " + this.elementId);
        //    console.warn("tiny ctor-3 " + this.elementId);
        //}
        //console.warn("tiny ctor-4 " + this.elementId);
    }

    public ngAfterViewInit(): void {
      //  console.warn("ngAfterViewInit start " + this.elementId);
        this.lazyService.loadJs("./scripts.js").subscribe(_ => {
       //     console.warn("ngAfterViewInit middle " + this.elementId);
            this.initTiny();
        });
  //      console.warn("ngAfterViewInit end " + this.elementId);
    }

    public setFocus() {
      //  console.warn("setFocus start " + this.elementId);
        this.isTinyDefinedO().subscribe(_ => {
            if (tinymce.editors && tinymce.editors[this.elementId]) {
       //         console.warn("setFocus middle " + this.elementId);
                tinymce.editors[this.elementId].selection.select(tinymce.editors[this.elementId].getBody(), true);
                tinymce.editors[this.elementId].selection.collapse(false);
                tinymce.editors[this.elementId].focus();
            }
        });
    //    console.warn("setFocus end " + this.elementId);
    }

    public get value(): string {
        return this._value;
    };

    public set value(value: string) {
        //     console.warn("value start " + this.elementId);
        this.isTinyDefinedO().subscribe(_ => {
            //         console.warn("value mid " + this.elementId);
            this.zone.run(() => {
                if (value !== this._value) {
                    this._value = value;
                    this.onChangeCallback(value);
                    this.onTouchedCallback();
            //        this.change.emit(value);
                }
            });
        });
    }

    public ngOnDestroy(): void {
    //    console.warn("ngOnDestroy start " + this.elementId);
        if (this.isTinyDefinedO() && this.editor) {
     //       console.warn("ngOnDestroy middle " + this.elementId);
            tinymce.remove(this.editor);
        }
    }

    public writeValue(value: any): void {
        this.value = value;

        this.isTinyDefinedO().subscribe(_ => {
            if (tinymce.editors && tinymce.editors[this.elementId]) {
                tinymce.editors[this.elementId].setContent((value) ? value : "");
            }
        });
    }

    public registerOnChange(fn: (_: any) => void): void {
        this.onChangeCallback = fn;
    }

    public registerOnTouched(fn: any): void {
        this.onTouchedCallback = fn;
    }

    private onTouchedCallback = () => { };
    private onChangeCallback = (x: any) => { };

    private getPlugins(): string {
        const common: string = `autolink image paste customEmoticons`;
        const type1: string = `advlist lists link hr media textcolor colorpicker ${common}`;
        if (this.type === 1) {
            return type1;
        }
        if (this.type === 2) {
            return `code fullscreen table visualblocks ${type1}`;
        }
        return common;
    }

    private getToolbar(): string {
        const common: string =
            `bold italic underline strikethrough | customEmoticons`;
        const type1: string = `styleselect | ${common} | link image media | fontsizeselect hr
                                 | bullist numlist | forecolor backcolor | alignleft aligncenter alignright alignjustify | outdent indent`;
        const type2: string = `undo redo | fullscreen ${type1} | table code | visualblocks`;
        if (this.type === 1) {
            return type1;
        }
        if (this.type === 2) {
            return type2;
        }
        return common;
    }

    private initTiny(): void {
    //    console.warn("initTiny start " + this.elementId);
        let settings1//: Settings
            = {
                autoresize_overflow_padding: 0,
                selector: `#${this.elementId}`,
                convert_urls: true,
                schema: "html5",
                fontsize_formats: "8pt 10pt 11pt 12pt 14pt 16pt",
                forced_root_block: "",
                min_height: this.height,
                browser_spellcheck: true,
                gecko_spellcheck: true,
                remove_trailing_brs: true,
                menubar: false,
                language: "ru",
                // inline: true,
                plugins: [
                    this.getPlugins()
                ],
                allow_script_urls: true,
                relative_urls: true,
                document_base_url: "/",
                toolbar: this.getToolbar(),
                visualblocks_default_state: true,
                external_plugins: {
                    customEmoticons: "/plugins/customEmoticons/plugin.js"
                },
                skin_url: "/src/lightgray",
                setup: (editor: any) => { //Editor) => {
                    this.editor = editor;
                    editor.on("init", () => this.zone.run(() => editor.setContent(this._value)));
                    editor.on("setcontent",
                        ({ content, format }: any) => format === "html" && content &&
                        this.zone.run(() => this.onChangeCallback(content)));
                    editor.on("change keyup undo redo", () => {
                        this.onChangeCallback(editor.getContent());
                        this.value = editor.getContent();
                    });
                    editor.on("blur", () => this.zone.run(() => this.onTouchedCallback()));
                }
            }
   //     console.warn("initTiny mid " + this.elementId);
        this.zone.runOutsideAngular(() => {
            tinymce.init(settings1);
        });
  //      console.warn("initTiny end " + this.elementId);
        this.elementLoaded.next("");
        this.elementLoaded.complete();
    }

    private isTinyDefinedO(): Observable<any> {
 //       console.info("isTinyDefinedO " + this.elementId);
        return this.elementLoaded.asObservable();
    }
}