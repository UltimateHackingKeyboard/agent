import {Directive, ElementRef, EventEmitter, Input, OnChanges, Output, Renderer, SimpleChanges } from '@angular/core';

const KEY_ENTER = 13;

@Directive({
  selector: '[contenteditableModel]',
  host: {
    '(blur)': 'onBlur()',
    '(keypress)': 'onKeypress($event)'
  }
})
export class ContenteditableModel implements OnChanges {
  @Input('contenteditableModel') model: any;
  @Input('contenteditableUpdateOnEnter') updateOnEnter: boolean;
  @Output('contenteditableModelChange') update = new EventEmitter();

  private lastViewModel: any;

  constructor(private elRef: ElementRef, private renderer: Renderer) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes[this.lastViewModel]) {
      this.lastViewModel = this.model;
      this.refreshView();
    }
  }

  onKeypress(event: any) {
    if (this.updateOnEnter && (event.which === KEY_ENTER)) {
      // Finish editing when Enter pressed
      this.renderer.invokeElementMethod(this.elRef.nativeElement, 'blur');
      return false;
    }
  }

  onBlur() {
    let value = this.elRef.nativeElement.innerText;
    this.lastViewModel = value;
    this.update.emit(value);
  }

  private refreshView() {
    this.elRef.nativeElement.innerText = this.model;
  }
}
