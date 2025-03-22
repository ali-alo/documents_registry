import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { DocumentCreateForm } from '../models/document-create-form.model';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { Result } from '../models/result.model';
import {
  DocumentDetails,
  DocumentGridItem,
} from '../models/document-grid-item.model';
import { DocumentUpdateForm } from '../models/document-update-form.model';

@Injectable({
  providedIn: 'root',
})
export class DocumentsService {
  private httpClient = inject(HttpClient);
  private _documents = signal<any>([]);
  private baseUrl = 'http://localhost:5119/api/documents';

  documents = this._documents.asReadonly();

  loadGridData$ = new BehaviorSubject(true);


  addDocument(document: DocumentCreateForm): Observable<Result> {
    const formData = new FormData();
    formData.append('registrationCode', document.registrationCode);
    formData.append('dateToSend', document.dateToSend.toUTCString());
    formData.append('documentCode', document.documentCode);
    formData.append('deliveryType', document.deliveryType.toString());
    formData.append('correspondentType', document.correspondentType.toString());
    formData.append('topic', document.topic);
    formData.append('description', document.description || '-'); // empty value is disregarded in form data
    formData.append('deadline', document.deadline.toUTCString());
    formData.append('isAvailable', document.isAvailable.toString());
    formData.append('isControlled', document.isControlled.toString());
    formData.append('file', document.file, document.file.name);

    return this.httpClient.post<Result>(this.baseUrl, formData);
  }

  getAllDocuments(): Observable<DocumentGridItem[]> {
    return this.loadGridData$.pipe(switchMap(() => this.httpClient.get<DocumentGridItem[]>(this.baseUrl)));
  }

  checkRegistrationCodeIsUnique(code: string): Observable<boolean> {
    return this.httpClient.get<boolean>(
      `${this.baseUrl}/check-registration-code/${code}`
    );
  }

  checkFileNameIsUnique(fileName: string): Observable<boolean> {
    return this.httpClient.get<boolean>(
      `${this.baseUrl}/check-file-name/${fileName}`
    );
  }

  getDocumentDetails(registrationCode: string): Observable<DocumentDetails> {
    return this.httpClient.get<DocumentDetails>(
      `${this.baseUrl}/${registrationCode}`
    );
  }

  updateDocument(
    registrationCode: string,
    updates: DocumentUpdateForm
  ): Observable<Result> {
    return this.httpClient.put<Result>(
      `${this.baseUrl}/${registrationCode}`,
      updates
    );
  }
}
