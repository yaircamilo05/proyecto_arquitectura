import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  WritableSignal,
  signal,
} from '@angular/core';
import { CpuComponentComponent } from '../cpu-component/cpu-component.component';
import { CpuRunnerService } from '../services/cpu-runner.service';
import { RegistersBankService } from '../services/registers-bank.service';

@Component({
  selector: 'app-registers-bank',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './registers-bank.component.html',
  styleUrl: './registers-bank.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistersBankComponent extends CpuComponentComponent {
  readonly registers = this.registersBankService.registersSignal.asReadonly();

  constructor(
    cpuRunnerService: CpuRunnerService,
    private registersBankService: RegistersBankService
  ) {
    super(cpuRunnerService);
    this.identifier = 'REGISTERS-BANK';
  }

  getBankQuantity(key: string) {
    return this.registers()[key];
  }
}
