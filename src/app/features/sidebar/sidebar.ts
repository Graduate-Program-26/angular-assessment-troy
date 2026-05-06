import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [HlmSidebarImports, RouterLink],
  templateUrl: './sidebar.html',
})
export class SidebarComponent {}
