import {
  ScrollDetectService
} from './../services/scroll-detect.service';
import {
  Directive,
  HostListener
} from '@angular/core';
import {
  Subject
} from 'rxjs';

@Directive({
  selector: '[appScrollDetect]'
})
export class ScrollDetectDirective {

  constructor(private scrollService: ScrollDetectService) {}


  @HostListener('scroll', ['$event'])
  onScroll(event: any): void {
    if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {
      this.scrollService.scrollEndDetection.next(true);
    }
  }

}
