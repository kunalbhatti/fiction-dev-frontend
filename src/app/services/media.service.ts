import { Observable } from 'rxjs';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class MediaService {
  constructor(private mediaObserver: MediaObserver){}

  getMediaSize(): Observable<MediaChange>{
   return this.mediaObserver.media$;
  }
}
