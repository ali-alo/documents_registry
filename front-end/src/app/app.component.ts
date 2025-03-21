import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ThemeService } from './services/theme.service';
import { FormComponent } from './form/form.component';

@Component({
  selector: 'app-root',
  imports: [MatButtonModule, ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly dialog = inject(MatDialog);
  readonly themeService = inject(ThemeService);

  
  openForm(): void {
    this.dialog.open(FormComponent, {
      height: '70vh',
    });
  }
}
