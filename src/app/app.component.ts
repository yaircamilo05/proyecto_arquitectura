import { Component } from '@angular/core';
import { CpuRunnerService } from './services/cpu-runner.service';
import { CpuComponentType } from './types/cpu-component.type';
import { PrincipalMemoryService } from './services/principal-memory.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(
    private cpuRunnerService: CpuRunnerService,
    private principalMemoryService: PrincipalMemoryService
  ) {}

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

  getLastElement() {
    const element = this.principalMemoryService.firstInstruction;
    console.log(element);
  }
}
