import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch, lucideListMusic, lucideRadio } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [HlmSidebarImports, RouterLink, NgIcon, HlmIcon],
  providers: [provideIcons({ lucideSearch, lucideListMusic, lucideRadio })],
  templateUrl: './sidebar.html',
})
export class SidebarComponent {}
