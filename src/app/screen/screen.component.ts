import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  signal,
} from '@angular/core';
import { ScreenService } from '../services/screen.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-screen',
  standalone: true,
  imports: [CommonModule],
  template: `<div>
    {{ screenContent() }}
  </div>`,
  styleUrl: './screen.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScreenComponent implements OnDestroy {
  screenContent = signal<string>('');
  subscription: Subscription;

  constructor(private screenService: ScreenService) {
    this.subscription = new Subscription();

    const screenSub = this.screenService.screenContent$.subscribe((val) => {
      this.screenContent.set(val);
    });

    this.subscription.add(screenSub);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
