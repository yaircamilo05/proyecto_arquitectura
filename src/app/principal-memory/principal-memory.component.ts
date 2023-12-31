import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  WritableSignal,
  signal,
} from '@angular/core';
import { CpuComponentComponent } from '../cpu-component/cpu-component.component';
import { CpuRunnerService } from '../services/cpu-runner.service';
import { InstructionType } from '../types/instruction.type';
import { PrincipalMemoryService } from '../services/principal-memory.service';

@Component({
  selector: 'app-principal-memory',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './principal-memory.component.html',
  styleUrl: './principal-memory.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrincipalMemoryComponent extends CpuComponentComponent {
  instructions: WritableSignal<string[]>;
  variables: WritableSignal<{ [key: string]: number }[]>;
  constructor(
    cpuRunnerService: CpuRunnerService,
    private principalMemoryService: PrincipalMemoryService
  ) {
    super(cpuRunnerService);

    this.instructions = signal([]);
    this.variables = this.principalMemoryService.variables;
    this.identifier = 'PRINCIPAL-MEMORY';
  }

  @Input()
  set initialInstructions(value: string[]) {
    this.instructions.set(value);
    this.principalMemoryService.instructions = value;
  }

  isImpar(index: number): boolean {
    return index % 2 !== 0;
  }

  getNameVariable(variable: { [key: string]: number }): string {
    return Object.keys(variable)[0];
  }

  getValueVariable(variable: { [key: string]: number }): number {
    return Object.values(variable)[0];
  }

  decimalToBinary(variable: { [key: string]: number }): string {
    const value = this.getValueVariable(variable);

    if (!value) {
      return '0000';
    }

    return value.toString(2);
  }
}
