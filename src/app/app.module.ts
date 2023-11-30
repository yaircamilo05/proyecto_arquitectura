import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CpuRunnerComponent } from './cpu-runner/cpu-runner.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, CpuRunnerComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
