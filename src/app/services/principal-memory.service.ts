import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PrincipalMemoryService {
  private _instructions?: string[];
  private _variables: [{ [key: string]: number }]= [{}];
  variables = signal<[{ [key: string]: number }]>([{}]);
  set instructions(values: string[]) {
    this._instructions = values;
  }

  get firstInstruction(): string | undefined {
    return this._instructions?.shift();
  }

  addVariable(key: string, value: number) {
    // Find variable in memory
    let variable = this._variables.find((variable) => variable[key] !== undefined);
  
    if (variable) {
      // If variable exists, update its value
      variable[key] = value;
    } else {
      // If variable does not exist, add it to memory
      this._variables.push({ [key]: value });
    }
  
    this.variables.set(this._variables);
    console.log(this._variables);
  }

  getVariable(key: string): number {
    // Get variable from memory
    const variable = this._variables.find((variable) => variable[key]);
    return variable ? variable[key] : 0;
  }
}
