import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
  WritableSignal,
  signal,
} from '@angular/core';
import { CpuRunnerService } from '../services/cpu-runner.service';
import { CpuComponentType } from '../types/cpu-component.type';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cpu-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: `./cpu-component.component.html`,
  styleUrls: ['./cpu-component.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CpuComponentComponent implements OnInit, OnDestroy {
  @Input()
  componentName?: string;

  @Input()
  identifier?: CpuComponentType;

  componentIsSelected: WritableSignal<boolean>;
  content: WritableSignal<string | string[] | number | null>;

  subscriptions: Subscription;

  constructor(protected cpuRunnerService: CpuRunnerService) {
    this.componentIsSelected = signal(false);
    this.content = signal(null);

    this.subscriptions = new Subscription();
  }

  ngOnInit(): void {
    if (this.identifier === 'PC' || this.identifier === 'MAR') {
      this.content.set(0);
    }

    const selectedCpuComponentSub =
      this.cpuRunnerService.selectedCpuComponent.subscribe((val) => {
        this.componentIsSelected.set(val === this.identifier);
        this.setContent();
      });

    this.subscriptions.add(selectedCpuComponentSub);
  }

  setContent() {
    const content = this.cpuRunnerService.selectedCpuComponentContent();
    if (!this.componentIsSelected()) {
      return;
    }

    if (content == null) {
      return;
    }

    if (!isNaN(Number(content))) {
      const number = content as number;
      this.content.update((value) => (value as number) + number);

      this.cpuRunnerService.resetContent();
      return;
    }

    this.content.set(content);
    this.cpuRunnerService.resetContent();
  }

  isBus() {
    return (
      this.identifier === 'CONTROL-BUS' ||
      this.identifier === 'DATA-BUS' ||
      this.identifier === 'DIRECTIONS-BUS'
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
