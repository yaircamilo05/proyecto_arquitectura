import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PrincipalMemoryService {
  private _instructions?: string[];
  private _variables: { [key: string]: number }= {};

  set instructions(values: string[]) {
    this._instructions = values;
  }

  get firstInstruction(): string | undefined {
    return this._instructions?.shift();
  }

  addVariable(key: string, value: number) {
    // Add variable to memory
    this._variables[key] = value;
  }

  getVariable(key: string): number {
    // Get variable from memory
    return this._variables[key];
  }
}
