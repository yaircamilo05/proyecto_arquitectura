import { Component } from '@angular/core';
import { CpuRunnerService } from './services/cpu-runner.service';
import { CpuComponentType } from './types/cpu-component.type';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private cpuRunnerService: CpuRunnerService) {}

  selectCpuComponent(component: CpuComponentType, content?: string | number) {
    if (content) {
      this.cpuRunnerService.selectComponentWitContent(component, content);
      return;
    }

    this.cpuRunnerService.selectComponent(component);
  }
}
