import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { DocumentForm } from '../models/document-form.model';
import { Observable } from 'rxjs';
import { Result } from '../models/result.model';
import { DocumentGridItem } from '../models/document-grid-item.model';

@Injectable({
  providedIn: 'root',
})
export class DocumentsService {
  private httpClient = inject(HttpClient);
  private _documents = signal<any>([]);
  private baseUrl = 'http://localhost:5119/api/documents/';

  documents = this._documents.asReadonly();

  addDocument(document: DocumentForm): Observable<Result> {
    const formData = new FormData();
    formData.append('registrationCode', document.registrationCode);
    formData.append('dateToSend', document.dateToSend.toUTCString());
    formData.append('documentCode', document.documentCode);
    formData.append('deliveryType', document.deliveryType.toString());
    formData.append('correspondentType', document.correspondentType.toString());
    formData.append('topic', document.topic);
    formData.append('description', document.description);
    formData.append('deadline', document.deadline.toUTCString());
    formData.append('isAvailable', document.isAvailable.toString());
    formData.append('isControlled', document.isControlled.toString());
    formData.append('file', document.file, document.file.name);

    return this.httpClient.post<Result>(this.baseUrl, formData);
  }

  getAllDocuments(): Observable<DocumentGridItem[]> {
    return this.httpClient.get<DocumentGridItem[]>(this.baseUrl);
  }
}
