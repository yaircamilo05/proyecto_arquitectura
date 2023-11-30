import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PrincipalMemoryService {
  private _instructions?: string[];

  set instructions(values: string[]) {
    this._instructions = values;
  }

  get firstInstruction(): string | undefined {
    return this._instructions?.shift();
  }
}
