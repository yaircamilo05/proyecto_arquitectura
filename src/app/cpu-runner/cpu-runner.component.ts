import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  signal,
} from '@angular/core';
import { CpuRunnerService } from '../services/cpu-runner.service';
import { CpuComponentComponent } from '../cpu-component/cpu-component.component';
import { PrincipalMemoryComponent } from '../principal-memory/principal-memory.component';
import { RegistersBankComponent } from '../registers-bank/registers-bank.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cpu-runner',
  standalone: true,
  imports: [
    CommonModule,
    CpuComponentComponent,
    PrincipalMemoryComponent,
    RegistersBankComponent,
  ],
  templateUrl: './cpu-runner.component.html',
  styleUrls: ['./cpu-runner.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CpuRunnerComponent implements OnDestroy {
  instructions = signal<string[]>([]);
  subscriptions: Subscription;

  constructor(private cpuRunnerService: CpuRunnerService) {
    this.subscriptions = new Subscription();

    const initialInstructionsSub =
      this.cpuRunnerService.initialInstructions$.subscribe((res) => {
        this.instructions.set(res);
      });

    this.subscriptions.add(initialInstructionsSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
