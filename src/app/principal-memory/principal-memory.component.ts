import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
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
  template: `<div [ngClass]="{ selected: componentIsSelected() }">
    <ng-content></ng-content>

    <div class="instructions">
      @for (instruction of instructions(); track $index) {
      <span>{{ instruction }}</span>
      }
    </div>
  </div>`,
  styleUrl: './principal-memory.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrincipalMemoryComponent extends CpuComponentComponent {
  instructions: WritableSignal<string[]>;

  constructor(
    cpuRunnerService: CpuRunnerService,
    private principalMemoryService: PrincipalMemoryService
  ) {
    super(cpuRunnerService);

    this.identifier = 'PRINCIPAL-MEMORY';
    this.instructions = signal([]);
  }

  override setContent(): void {
    const content = this.cpuRunnerService.selectedCpuComponentContent();

    if (this.isArray(content)) {
      this.instructions.set(content as string[]);
      this.content.set(content);
      this.principalMemoryService.instructions = content as string[];

      this.cpuRunnerService.resetContent();
    }
  }

  isArray(content: string | string[] | number | null) {
    return Array.isArray(content);
  }
}
