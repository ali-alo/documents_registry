import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ThemeService } from './services/theme.service';
import { TableComponent } from './table/table.component';
import { GridControlsComponent } from './grid-controls/grid-controls.component';

@Component({
  selector: 'app-root',
  imports: [
    MatButtonModule,
    TableComponent,
    MatIconModule,
    GridControlsComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly themeService = inject(ThemeService);
  useDarkTheme = computed(() => this.themeService.currentTheme() === 'dark');
  
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
