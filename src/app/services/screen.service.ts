import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScreenService {
  screenContent$ = new BehaviorSubject<string>('');

  constructor() {}

  setScreenContent(content: string) {
    this.screenContent$.next(content);
  }

  resetContent() {
    this.screenContent$.next('');
  }
}
