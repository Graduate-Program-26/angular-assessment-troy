import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { SidebarComponent } from './features/sidebar/sidebar';
import { Player } from './features/player/player';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SidebarComponent, HlmSidebarImports, RouterOutlet, Player],
  templateUrl: './app.html',
})
export class App {}
