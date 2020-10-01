import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollDetectService{
	scrollEndDetection = new Subject();
}
