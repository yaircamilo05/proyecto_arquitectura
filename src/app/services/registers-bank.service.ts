import { Injectable, WritableSignal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RegistersBankService {
  registersSignal: WritableSignal<{ [key: string]: number }>;

  constructor() {
    let initialRegisters = {
      Ax: 0,
      Bx: 0,
      Cx: 0,
      Dx: 0,
      Ex: 0,
      Fx: 0,
      Gx: 0,
      Hx: 0,
    };

    this.registersSignal = signal(initialRegisters);
  }

  set registers(value: { [value: string]: number }) {
    this.registersSignal.set(value);
  }

  addValueToRegister(key: string, value: number) {
    const registers = this.registersSignal();

    if (registers[key] !== null && registers[key] !== undefined) {
      registers[key] = value;

      this.registersSignal.set({ ...registers });
    }
  }

  popRegisterValue(key: string) {
    const registers = this.registersSignal();

    if (registers[key] === null || registers[key] === undefined) {
      return;
    }

    const value = registers[key];
    registers[key] = 0;
    this.registersSignal.set({ ...registers });

    return value;
  }

  getRegisterValue(){
    const registers = this.registersSignal();
    console.log(registers);
    return registers; 
  }

}
