import { Component, signal } from '@angular/core';
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
import { ScreenService } from './services/screen.service';

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

  cicloActual = signal<string>('');

  constructor(
    private cpuRunnerService: CpuRunnerService,
    private principalMemoryService: PrincipalMemoryService,
    private registersBankService: RegistersBankService,
    private screenService: ScreenService,
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
          await this.mov(line);
          break;
        case 'ADD':
          await this.add(line);
          break;
        case 'SUB':
          await this.sub(line);
          break;
        case 'MUL':
          await this.mul(line);
          break;
        case 'DIV':
          await this.div(line);
          break;
        case 'NEW':
          await this.new(line);
          break;
        case 'PRINT':
          await this.print(line);
          break;
        default:
          break;
      }
    }
    instructions.forEach((instruction) => {});
  }

  async new(line: string[]) {
    //ciclo de creacion de variable en memoria
    // UC, BC, Memory, UC, BDir, BD
    const key = line[1];
    const value = line[2];

    await this.cicloGuardadoEnMemoria();

    this.principalMemoryService.addVariable(key, parseInt(value));
  }

  async print(line: string[]) {
    //ciclo de impresion en pantalla
    const keyValue1 = line[1];

    const value = await this.buscarVariable(keyValue1);

    this.screenService.setScreenContent(value.toString());
  }

  async mov(line: string[]) {
    const keyValue1 = line[1];
    const keyValue2 = line[2];

    const value2 = await this.buscarVariable(keyValue2);
    await this.guardarVariable(keyValue1, value2);
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
    await this.pintarOperacion(`${keyValue1} + ${keyValue2}`);
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
    await this.pintarOperacion(`${keyValue1} - ${keyValue2}`);

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
    await this.pintarOperacion(`${keyValue1} X ${keyValue2}`);

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
    await this.pintarOperacion(`${keyValue1} / ${keyValue2}`);

    //Hacer el ciclo de escritura de dato en memoria
    this.guardarVariable(keyValue1, result);
  }
  //este pinta
  async cicloCaptacionDatoMemoria() {
    //Ejecutar ciclo de captacion de dato
    //uc, bc, memory, uc, pc, mar, bd, memory, bd, mbr, alu
    this.cicloActual.set('Ciclo captación de dato de memoria');
    const components: CpuComponentType[] = [
      'CONTROL-BUS',
      'PRINCIPAL-MEMORY',
      'UC',
      'DIRECTIONS-BUS',
      'PRINCIPAL-MEMORY',
      'DATA-BUS',
      'MBR',
      'UC',
    ];

    if (this.cpuRunnerService.selectedCpuComponent.value !== 'UC') {
      this.selectCpuComponent('UC');
    }
    for (const component of components) {
      await this.selectCpuComponentTime(component);
    }

    this.cicloActual.set('');
  }

  async cicloCaptacionDatoBR() {
    this.cicloActual.set('Ciclo captación de dato en banco de registros');
    const components: CpuComponentType[] = ['REGISTERS-BANK', 'UC'];

    if (this.cpuRunnerService.selectedCpuComponent.value !== 'UC') {
      this.selectCpuComponent('UC');
    }

    for (const component of components) {
      await this.selectCpuComponentTime(component);
    }

    this.cicloActual.set('Ciclo captación de dato en banco de registros');
  }

  async cicloCaptacionInstruccion() {
    this.cicloActual.set('Ciclo captación de instrucción');
    const components: CpuComponentType[] = [
      'CONTROL-BUS',
      'PRINCIPAL-MEMORY',
      'UC',
      'PC',
      'MAR',
      'DIRECTIONS-BUS',
      'PRINCIPAL-MEMORY',
      'DIRECTIONS-BUS',
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

    this.cicloActual.set('');
  }

  async cicloGuardadoEnMemoria() {
    this.cicloActual.set('Ciclo guardado de dato en memoria principal');
    //Ejecutar ciclo de captacion de instruccion
    //uc, bc, memory, uc, pc, mar, bd, memory, bd, mbr, ir

    const components: CpuComponentType[] = [
      'CONTROL-BUS',
      'PRINCIPAL-MEMORY',
      'UC',
      'DIRECTIONS-BUS',
      'PRINCIPAL-MEMORY',
      'UC',
      'DATA-BUS',
      'PRINCIPAL-MEMORY',
    ];

    this.selectCpuComponent('UC');
    for (const component of components) {
      await this.selectCpuComponentTime(component);
    }

    this.cicloActual.set('');
  }

  async cicloGuardadoEnBr() {
    this.cicloActual.set('Ciclo guardado de dato en banco de registros');

    const components: CpuComponentType[] = ['REGISTERS-BANK', 'UC'];

    this.selectCpuComponent('UC');
    for (const component of components) {
      await this.selectCpuComponentTime(component);
    }

    this.cicloActual.set('');
  }

  async pintarOperacion(contenido: string) {
    const components: CpuComponentType[] = ['ALU', 'UC'];

    for (const component of components) {
      if (component === 'ALU') {
        this.cicloActual.set('Realizando operación en ALU');
        await this.selectCpuComponentTime(component, contenido);
        continue;
      }

      await this.selectCpuComponentTime(component);
    }

    this.cicloActual.set('');
  }

  selectCpuComponentTime(
    component: CpuComponentType,
    content?: string | number
  ): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (content) {
          this.cpuRunnerService.selectComponentWitContent(component, content);
          resolve(true);
        }

        this.cpuRunnerService.selectComponent(component);
        resolve(true);
      }, 1000);
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

  async guardarVariable(key: string, value: number) {
    const valueBr = this.registersBankService.popRegisterValue(key);
    if (valueBr !== null && valueBr !== undefined) {
      await this.cicloGuardadoEnBr();
      this.registersBankService.addValueToRegister(key, value);
      return;
    }

    await this.cicloGuardadoEnMemoria();
    this.principalMemoryService.addVariable(key, value);
  }
}
