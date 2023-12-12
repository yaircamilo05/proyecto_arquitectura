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
  ) {
    if (content) {
      this.cpuRunnerService.selectComponentWitContent(component, content);
      return;
    }

    this.cpuRunnerService.selectComponent(component);
  }

  executeInstructions() {
    const instructionsValue = this.instructionsForm.controls.instructions.value;
    const instructions = instructionsValue.split(';');
    this.cpuRunnerService.initialInstructions = instructions;
    this.run(instructions);
    // Start here
  }

  async run(instructions: string[]) {
    for (const instruction of instructions) {
      await this.cicloCaptacionInstruccion();
      const line: string[] = instruction.trim().replace(' ', '').split(',');
      const command = line[0];
      switch (command.toUpperCase()) {
        case 'MOV':
          this.mov(line);
          break;
        case 'ADD':
          this.add(line);
          break;
        case 'SUB':
          this.sub(line);
          break;
        case 'MUL':
          this.mul(line);
          break;
        case 'DIV':
          this.div(line);
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
    }
    instructions.forEach((instruction) => {});
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

    //lucho le hace falta hacer la impresion en pantalla
    console.log(value);
  }

  mov(line: string[]) {
    const keyValue1 = line[1];
    const keyValue2 = line[2];
    //Validar si es un registro o una variable TO DO
    const value2 = this.principalMemoryService.getVariable(keyValue2);
    this.principalMemoryService.addVariable(keyValue1, value2);
  }

  async add(line: string[]) {
    //se hace el primer ciclo de captacion de dato
    const keyValue1 = line[1];
    //se hace el segundo ciclo de captacion de dato
    const keyValue2 = line[2];

    const value1 = await this.buscarVariable(keyValue1);
    const value2 = await this.buscarVariable(keyValue2);

    const result = value1 + value2;
    //Hacer el ciclo de escritura de dato en memoria
    console.log(result);
    this.guardarVariable(keyValue1, result);
    console.log(this.principalMemoryService.getVariable(keyValue1));
  }

  async sub(line: string[]) {
    const keyValue1 = line[1];
    //se hace el segundo ciclo de captacion de dato
    const keyValue2 = line[2];

    const value1 = await this.buscarVariable(keyValue1);

    const value2 = await this.buscarVariable(keyValue2);

    const result = value1 - value2;
    //Hacer el ciclo de escritura de dato en memoria
    this.guardarVariable(keyValue1, result);
  }

  async mul(line: string[]) {
    const keyValue1 = line[1];
    //se hace el segundo ciclo de captacion de dato
    const keyValue2 = line[2];

    const value1 = await this.buscarVariable(keyValue1);

    const value2 = await this.buscarVariable(keyValue2);

    const result = value1 * value2;
    //Hacer el ciclo de escritura de dato en memoria
    this.guardarVariable(keyValue1, result);
  }

  async div(line: string[]) {
    const keyValue1 = line[1];
    //se hace el segundo ciclo de captacion de dato
    const keyValue2 = line[2];

    const value1 = await this.buscarVariable(keyValue1);

    const value2 = await this.buscarVariable(keyValue2);

    const result = value1 / value2;
    //Hacer el ciclo de escritura de dato en memoria
    this.guardarVariable(keyValue1, result);
  }
  //este pinta
  async cicloCaptacionDatoMemoria() {
    //Ejecutar ciclo de captacion de dato
    //uc, bc, memory, uc, pc, mar, bd, memory, bd, mbr, alu
    const components: CpuComponentType[] = [
      'CONTROL-BUS',
      'PRINCIPAL-MEMORY',
      'UC',
      'PC',
      'MAR',
      'DIRECTIONS-BUS',
      'PRINCIPAL-MEMORY',
      'DATA-BUS',
      'MBR',
      'ALU',
    ];

    if (this.cpuRunnerService.selectedCpuComponent.value !== 'UC') {
      this.selectCpuComponent('UC');
    }

    for (const component of components) {
      await this.selectCpuComponentTime(component);
    }
  }

  async cicloCaptacionDatoBR() {
    //Ejecutar ciclo de captacion de dato del banco de registros
    //uc, BancoR, alu
    const components: CpuComponentType[] = ['REGISTERS-BANK', 'ALU'];

    if (this.cpuRunnerService.selectedCpuComponent.value !== 'UC') {
      this.selectCpuComponent('UC');
    }

    for (const component of components) {
      await this.selectCpuComponentTime(component);
    }
  }

  async cicloCaptacionInstruccion() {
    //Ejecutar ciclo de captacion de instruccion
    //uc, bc, memory, uc, pc, mar, bd, memory, bd, mbr, ir

    const components: CpuComponentType[] = [
      'CONTROL-BUS',
      'PRINCIPAL-MEMORY',
      'UC',
      'PC',
      'MAR',
      'DIRECTIONS-BUS',
      'PRINCIPAL-MEMORY',
      'DATA-BUS',
      'IR',
      'UC',
    ];

    this.selectCpuComponent('UC');
    for (const component of components) {
      if (component === 'PC' || component === 'MAR') {
        await this.selectCpuComponentTime(component, 1);
        continue;
      }

      await this.selectCpuComponentTime(component);
    }
  }

  selectCpuComponentTime(
    component: CpuComponentType,
    content?: string | number
  ) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (content) {
          this.cpuRunnerService.selectComponentWitContent(component, content);
          resolve(true);
        }

        this.cpuRunnerService.selectComponent(component);
        resolve(true);
      }, 2000);
    });
  }

  async buscarVariable(key: string) {
    const value = this.registersBankService.popRegisterValue(key);
    if (value !== null && value !== undefined) {
      await this.cicloCaptacionDatoBR();
      return value;
    } else {
      await this.cicloCaptacionDatoMemoria();
      return this.principalMemoryService.getVariable(key);
    }
  }

  guardarVariable(key: string, value: number) {
    const valueBr = this.registersBankService.popRegisterValue(key);
    console.log(valueBr, 'valor del banco de registros');
    if (valueBr !== null && valueBr !== undefined) {
      this.registersBankService.addValueToRegister(key, value);
      //aqui se pinta como se guarda en el banco de registros

      return;
    } else {
      this.principalMemoryService.addVariable(key, value);
      console.log(this.principalMemoryService.getVariable(key), 'memoria');
      //aqui se pinta como se guarda en la memoria
      return;
    }
  }
}
