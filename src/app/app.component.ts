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
    this.run(instructions)
    // Start here
  }

  run(instructions: string[]) {
    instructions.forEach((instruction) => {
      this.cicloCaptacionInstruccion()
      const line : string []= instruction.trim().replace(' ','').split(',');
      const command = line[0];
      switch (command.toUpperCase()) {
        case 'MOV':
          this.mov(line);
          break;
        case 'ADD':
          this.add(line);
          break;
        case 'SUB':
          //this.sub(line);
          break;
        case 'MUL':
          //this.cmp(line);
          break;
        case 'DIV':
          //this.jmp(line);
          break;
        case 'NEW':
          this.new(line);
          break;
        case 'PRINT':
          this.print(line);
          break;
        default:
          break;
      }
    });

  }

  new(line: string[]) {
    //ciclo de creacion de variable en memoria
    // UC, BC, Memory, UC, BDir, BD
    const key = line[1];
    const value = line[2];
    this.principalMemoryService.addVariable(key, parseInt(value));
  }

  print(line: string[]) {
    //ciclo de impresion en pantalla
    const keyValue1 = line[1];
    const value = this.principalMemoryService.getVariable(keyValue1);
    console.log(value);
  }


  mov(line: string[]) {
    const keyValue1 = line[1];
    const keyValue2 = line[2];
    //Validar si es un registro o una variable TO DO
    const value2= this.principalMemoryService.getVariable(keyValue2);
    this.principalMemoryService.addVariable(keyValue1, value2);
  }

  add(line: string[]) {
    //se hace el primer ciclo de captacion de dato
    const keyValue1 = line[1];
    //se hace el segundo ciclo de captacion de dato
    const keyValue2 = line[2];

    const value1= this.principalMemoryService.getVariable(keyValue1);
    const value2= this.principalMemoryService.getVariable(keyValue2);

    const result = value1 + value2;
    //Hacer el ciclo de escritura de dato en memoria
    this.principalMemoryService.addVariable(keyValue1, result);


    /* const value = line[2];



    const dataRegister = this.registersBankService.popRegisterValue(line[1]);
    if (dataRegister !== null && dataRegister !== undefined) {
      const result = dataRegister + parseInt(value);
      this.registersBankService.addValueToRegister(line[1], result);
    }
    else{

    } */
  }
//este pinta
  cicloCaptacionDatoMemoria() {
    //Ejecutar ciclo de captacion de dato
    //uc, bc, memory, uc, pc, mar, bd, memory, bd, mbr, alu
  }


  cicloCaptacionDatoBR() {
    //Ejecutar ciclo de captacion de dato del banco de registros
    //uc, BancoR, alu
  }

  cicloCaptacionInstruccion() {
      //Ejecutar ciclo de captacion de instruccion
      //uc, bc, memory, uc, pc, mar, bd, memory, bd, mbr, ir
  }

}
