import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {
  private _documents = signal<any>([]);

  documents = this._documents.asReadonly();

  addDocument(document: any): void {
    document.fileName = document.file.name;
    this._documents.update(docs => [...docs, document]);
  }
}
