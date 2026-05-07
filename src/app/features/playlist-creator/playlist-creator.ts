import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideChevronRight,
  lucideListMusic,
  lucidePencil,
  lucideCheck,
  lucideX,
  lucideTrash2,
} from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { PlaylistStore } from '../../store/playlist.store';

@Component({
  selector: 'app-playlists',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmButtonImports, HlmInputImports, HlmSeparatorImports, NgIcon, ReactiveFormsModule],
  providers: [
    provideIcons({
      lucideChevronRight,
      lucideListMusic,
      lucidePencil,
      lucideCheck,
      lucideX,
      lucideTrash2,
    }),
  ],
  templateUrl: './playlist-creator.html',
})
export class PlaylistsComponent implements OnInit {
  readonly store = inject(PlaylistStore);
  readonly router = inject(Router);

  readonly createForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  readonly editingId = signal<number | null>(null);
  readonly editingName = signal('');

  ngOnInit(): void {
    this.store.loadPlaylists();
  }

  create(): void {
    if (this.createForm.invalid) return;
    this.store.createPlaylist(this.createForm.controls.name.value);
    this.createForm.reset();
  }

  navigate(id: number): void {
    if (this.editingId() !== null) return;
    this.router.navigate(['/playlist', id]);
  }

  startEdit(event: Event, id: number, name: string): void {
    event.stopPropagation();
    this.editingId.set(id);
    this.editingName.set(name);
  }

  confirmEdit(event: Event): void {
    event.stopPropagation();
    const id = this.editingId();
    const name = this.editingName().trim();
    if (id !== null && name) {
      this.store.renamePlaylist(id, name);
    }
    this.editingId.set(null);
  }

  cancelEdit(event: Event): void {
    event.stopPropagation();
    this.editingId.set(null);
  }

  delete(event: Event, id: number): void {
    event.stopPropagation();
    this.store.deletePlaylist(id);
  }

  onEditInput(event: Event): void {
    this.editingName.set((event.target as HTMLInputElement).value);
  }
}
