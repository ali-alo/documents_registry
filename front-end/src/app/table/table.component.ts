import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Sort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { DocumentsService } from '../services/documents.service';
import { AsyncPipe, DatePipe } from '@angular/common';
import { map, Observable, of, tap } from 'rxjs';
import { getCorrespondentTypeName } from '../models/custom-types';
import { MatDialog } from '@angular/material/dialog';
import { FormComponent } from '../form/form.component';
import { DocumentGridItemDisplay } from '../models/document-grid-item.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-table',
  imports: [MatTableModule, MatSortModule, DatePipe, AsyncPipe],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent implements OnInit {
  private readonly documentsService = inject(DocumentsService);
  private readonly dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);

  dataSource$ = this.getRowsFromServer();
  originalData: DocumentGridItemDisplay[] = [];

  ngOnInit(): void {
    this.documentsService.loadGridData$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.reloadData());
  }

  private reloadData(): void {
    this.dataSource$ = this.getRowsFromServer();
  }

  private getRowsFromServer(): Observable<DocumentGridItemDisplay[]> {
    return this.documentsService.getAllDocuments().pipe(
      map((docs) =>
        docs.map((doc) => ({
          ...doc,
          correspondentType: getCorrespondentTypeName(doc.correspondentType),
        }))
      ),
      tap((data) => (this.originalData = data))
    );
  }

  displayedColumns = [
    'fileName',
    'registrationCode',
    'registrationDate',
    'documentCode',
    'dateToSend',
    'correspondentType',
    'topic',
  ];

  sortData(sort: Sort): void {
    if (!sort.active || sort.direction === '') {
      this.dataSource$ = of(this.originalData); // reset to initial value
      return;
    }
    const sortedData = [...this.originalData].sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'fileName':
          return this.compare(a.fileName, b.fileName, isAsc);
        case 'registrationCode':
          return this.compare(a.registrationCode, b.registrationCode, isAsc);
        case 'registrationDate':
          return this.compare(a.registrationDate, b.registrationDate, isAsc);
        case 'documentCode':
          return this.compare(a.documentCode, b.documentCode, isAsc);
        case 'dateToSend':
          return this.compare(a.dateToSend, b.dateToSend, isAsc);
        case 'correspondentType':
          return this.compare(a.correspondentType, b.correspondentType, isAsc);
        case 'topic':
          return this.compare(a.topic, b.topic, isAsc);
        default:
          return 0;
      }
    });
    this.dataSource$ = of(sortedData);
  }

  private compare(
    a: number | string | Date,
    b: number | string | Date,
    isAsc: boolean
  ) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  onDoubleClick(registrationCode: string): void {
    this.dialog.open(FormComponent, {
      height: '70vh',
      data: registrationCode,
    });
  }

  showFile(fileName: string): void {
    this.documentsService.showFile(fileName);
  }
}
