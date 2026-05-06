import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { SidebarComponent } from './features/sidebar/sidebar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SidebarComponent, HlmSidebarImports, RouterOutlet],
  templateUrl: './app.html',
})
export class App {}
