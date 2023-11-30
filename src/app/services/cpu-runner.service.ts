import { Injectable, signal } from '@angular/core';
import { CpuComponentType } from '../types/cpu-component.type';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CpuRunnerService {
  selectedCpuComponent = new BehaviorSubject<CpuComponentType | null>(null);
  selectedCpuComponentContent = signal<string | string[] | number | null>(null);

  selectComponent(component: CpuComponentType) {
    this.selectedCpuComponent.next(component);
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
