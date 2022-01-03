import {ElementPart, html, noChange, Part} from "lit";
import {Directive} from 'lit/directive.js';

export class ScrollToBottomAfterUpdateDirective  extends Directive {
  render() {
    return noChange;
  }

  update(part: ElementPart): any {
    setTimeout(() => {
      part.element.scroll(0, part.element.scrollHeight);
    }, 0);
    return noChange;
  }
}