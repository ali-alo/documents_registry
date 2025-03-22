import { Component, inject } from '@angular/core';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DocumentsService } from '../services/documents.service';
import { AsyncPipe, DatePipe } from '@angular/common';
import { map } from 'rxjs';
import { getCorrespondentTypeName } from '../models/custom-types';
import { MatDialog } from '@angular/material/dialog';
import { FormComponent } from '../form/form.component';

@Component({
  selector: 'app-table',
  imports: [MatTableModule, MatSortModule, DatePipe, AsyncPipe],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  private readonly documentsService = inject(DocumentsService);
  private readonly dialog = inject(MatDialog);

  dataSource$ = this.documentsService.getAllDocuments().pipe(
    map((docs) =>
      docs.map((doc) => ({
        ...doc,
        correspondentType: getCorrespondentTypeName(doc.correspondentType),
      }))
    )
  );

  displayedColumns = [
    'fileName',
    'registrationCode',
    'registrationDate',
    'documentCode',
    'dateToSend',
    'correspondentType',
    'topic',
  ];

  sortData(data: Sort): void {
    console.log(data);
  }

  onDoubleClick(registrationCode: string): void {
    this.dialog.open(FormComponent, {
      height: '70vh',
      data: registrationCode,
    });
  }
}
