import { Directive, HostListener, Input } from "@angular/core";

@Directive({
  selector: "[click-event]"
})
export class ClickEventDirective {
  @Input("click-event-params") params = [];

  constructor() {}
  @HostListener("click", ["$event"])
  public onClick(event: any): void {
    if (this.params.includes("preventDefault")) event.preventDefault();
    if (this.params.includes("stopPropagation")) event.stopPropagation();
    if (this.params.includes("stopImmediatePropagation"))
      event.stopImmediatePropagation();
  }
}
