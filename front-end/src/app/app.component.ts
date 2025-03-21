import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ThemeService } from './services/theme.service';
import { FormComponent } from './form/form.component';
import { TableComponent } from "./table/table.component";

@Component({
  selector: 'app-root',
  imports: [MatButtonModule, TableComponent, MatIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly dialog = inject(MatDialog);
  private readonly themeService = inject(ThemeService);

  useDarkTheme = computed(() => this.themeService.currentTheme() === 'dark');

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  openForm(): void {
    this.dialog.open(FormComponent, {
      height: '70vh',
    });
  }
}
