import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideSearch,
  lucideListMusic,
  lucideRadio,
  lucideSun,
  lucideMoon,
  lucideLogIn,
  lucideLogOut,
} from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '@auth0/auth0-angular';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [HlmSidebarImports, RouterLink, NgIcon, HlmIcon, HlmButtonImports],

  providers: [
    provideIcons({
      lucideSearch,
      lucideListMusic,
      lucideRadio,
      lucideSun,
      lucideMoon,
      lucideLogOut,
      lucideLogIn,
    }),
  ],
  templateUrl: './sidebar.html',
})
export class SidebarComponent {
  readonly theme = inject(ThemeService);
  private readonly auth = inject(AuthService);

  readonly isAuthenticated = toSignal(this.auth.isAuthenticated$, { initialValue: false });
  readonly user = toSignal(this.auth.user$);

  login(): void {
    this.auth.loginWithRedirect();
  }

  logout(): void {
    this.auth.logout({ logoutParams: { returnTo: window.location.origin } });
  }
}
