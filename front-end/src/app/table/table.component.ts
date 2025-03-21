import { Component, inject } from '@angular/core';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DocumentsService } from '../services/documents.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-table',
  imports: [MatTableModule, MatSortModule, DatePipe],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  private readonly documentsService = inject(DocumentsService);

  dataSource = this.documentsService.documents;
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
}
