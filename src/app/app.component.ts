import { Component } from '@angular/core';
import { CpuRunnerService } from './services/cpu-runner.service';
import { CpuComponentType } from './types/cpu-component.type';
import { PrincipalMemoryService } from './services/principal-memory.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RegistersBankService } from './services/registers-bank.service';

interface InstructionsForm {
  instructions: FormControl<string>;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  instructionsForm: FormGroup<InstructionsForm>;

  constructor(
    private cpuRunnerService: CpuRunnerService,
    private principalMemoryService: PrincipalMemoryService,
    private registersBankService: RegistersBankService,
    private fb: FormBuilder
  ) {
    this.instructionsForm = new FormGroup({
      instructions: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }

  selectCpuComponent(
    component: CpuComponentType,
    content?: string | number | string[]
  ) {}

  executeInstructions() {
    const instructionsValue = this.instructionsForm.controls.instructions.value;
    const instructions = instructionsValue.split(';');

    this.cpuRunnerService.initialInstructions = instructions;

    // Start here
  }
}
