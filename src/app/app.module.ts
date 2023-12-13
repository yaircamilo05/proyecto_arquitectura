import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CpuRunnerComponent } from './cpu-runner/cpu-runner.component';

import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ReactiveFormsModule } from '@angular/forms';
import { ScreenComponent } from './screen/screen.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextareaModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ScreenComponent,
    CpuRunnerComponent,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
