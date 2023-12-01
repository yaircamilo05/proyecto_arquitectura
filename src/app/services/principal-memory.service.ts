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
    // Add variable to memory
    this._variables.push({ [key]: value });
    this.variables.set(this._variables);
  }

  getVariable(key: string): number {
    // Get variable from memory
    const variable = this._variables.find((variable) => variable[key]);
    return variable ? variable[key] : 0;
  }
}
