import { Injectable, signal } from '@angular/core';
import { CpuComponentType } from '../types/cpu-component.type';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CpuRunnerService {
  selectedCpuComponent = new BehaviorSubject<CpuComponentType | null>(null);
  selectedCpuComponentContent = signal<string | string[] | number | null>(null);

  initialInstructions$ = new BehaviorSubject<string[]>([]);

  selectComponent(component: CpuComponentType) {
    this.selectedCpuComponent.next(component);
  }

  set initialInstructions(value: string[]) {
    this.initialInstructions$.next(value);
  }

  selectComponentWitContent(
    component: CpuComponentType,
    content: string | string[] | number
  ) {
    this.selectedCpuComponentContent.set(content);
    this.selectedCpuComponent.next(component);
  }

  resetContent() {
    this.selectedCpuComponentContent.set(null);
  }
}
