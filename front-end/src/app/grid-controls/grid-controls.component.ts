import { Component, inject } from '@angular/core';
import { FormComponent } from '../form/form.component';
import { MatDialog } from '@angular/material/dialog';
import { DocumentsService } from '../services/documents.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-grid-controls',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './grid-controls.component.html',
  styleUrl: './grid-controls.component.scss',
})
export class GridControlsComponent {
  private readonly dialog = inject(MatDialog);
  private readonly documentService = inject(DocumentsService);

  refreshGrid(): void {
    this.documentService.loadGridData$.next(true);
  }

  openForm(): void {
    this.dialog.open(FormComponent, {
      height: '70vh',
    });
  }
}
