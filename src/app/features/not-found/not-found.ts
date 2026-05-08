import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col items-center justify-center h-full gap-4 mt-32">
      <p class="text-6xl font-bold text-black">404</p>
      <p class="text-lg text-black">Page not found</p>
    </div>
  `,
})
export class NotFound {}
