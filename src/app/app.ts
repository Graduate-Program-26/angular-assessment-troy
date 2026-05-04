import { Component, signal } from '@angular/core';
import { AppButton } from './button-demo/button-demo';

@Component({
  selector: 'app-root',
  imports: [AppButton],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('angular-assessment-troy');
}
