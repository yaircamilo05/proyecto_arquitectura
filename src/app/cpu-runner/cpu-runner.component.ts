import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CpuRunnerService } from '../services/cpu-runner.service';
import { CpuComponentComponent } from '../cpu-component/cpu-component.component';

@Component({
  selector: 'app-cpu-runner',
  standalone: true,
  imports: [CommonModule, CpuComponentComponent],
  templateUrl: './cpu-runner.component.html',
  styleUrls: ['./cpu-runner.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CpuRunnerComponent {
  constructor(private cpuRunnerService: CpuRunnerService) {}
}
