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
import { ScreenComponent } from '../screen/screen.component';

@Component({
  selector: 'app-cpu-runner',
  standalone: true,
  templateUrl: './cpu-runner.component.html',
  styleUrls: ['./cpu-runner.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    CpuComponentComponent,
    PrincipalMemoryComponent,
    RegistersBankComponent,
    ScreenComponent,
    ScreenComponent,
  ],
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
