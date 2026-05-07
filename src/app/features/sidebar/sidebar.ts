import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideSearch,
  lucideListMusic,
  lucideRadio,
  lucideSun,
  lucideMoon,
} from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [HlmSidebarImports, RouterLink, NgIcon, HlmIcon, HlmButtonImports],
  providers: [provideIcons({ lucideSearch, lucideListMusic, lucideRadio, lucideSun, lucideMoon })],
  templateUrl: './sidebar.html',
})
export class SidebarComponent {
  readonly theme = inject(ThemeService);
}
