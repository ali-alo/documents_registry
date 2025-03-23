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
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DocumentsService {
  private httpClient = inject(HttpClient);
  private _documents = signal<any>([]);
  private baseUrl = environment.apiurl;
  private fileObjectUrl: string | null = null;

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
    return this.httpClient.get<DocumentGridItem[]>(this.baseUrl);
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

  showFile(fileName: string): void {
    this.getFileUrl(fileName).subscribe((blob) => {
      if (this.fileObjectUrl) {
        URL.revokeObjectURL(this.fileObjectUrl);
      }

      this.fileObjectUrl = URL.createObjectURL(blob);

      // browsers can display PDF files, show them directly there
      // if is not a pdf file, allow users to install them
      fileName.toLowerCase().endsWith('.pdf')
        ? window.open(this.fileObjectUrl, '_blank')
        : this.downloadFile(fileName);
    });
  }

  private getFileUrl(fileName: string) {
    return this.httpClient.get(`${this.baseUrl}/get-file/${fileName}`, {
      responseType: 'blob',
    });
  }

  private downloadFile(fileName: string): void {
    const link = document.createElement('a');
    link.href = this.fileObjectUrl ?? '';
    link.download = fileName;
    link.click();
  }
}
