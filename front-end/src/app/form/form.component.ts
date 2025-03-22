import { Component, computed, inject, ViewEncapsulation } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DocumentsService } from '../services/documents.service';
import { DocumentForm } from '../models/document-form.model';
import { CORRESPONDENT_TYPES, DELIVERY_TYPES } from '../models/custom-types';
import { debounceTime, filter, map, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-form',
  providers: [provideNativeDateAdapter()],
  imports: [
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatDividerModule,
    MatSlideToggleModule,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class FormComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly snackBar = inject(MatSnackBar);
  private readonly documentsService = inject(DocumentsService);

  private readonly atLeastOneDigitRegEx =
    /([0-9]+)|([A-Яa-я]+[^A-Яa-я0-9]+)|([^A-Яa-я0-9]+[A-Яa-я]+)/;
  private readonly regexValidator = Validators.pattern(
    this.atLeastOneDigitRegEx
  );

  readonly deliveryTypes = DELIVERY_TYPES;
  readonly correspondentTypes = CORRESPONDENT_TYPES;

  currentDate = new Date();
  oneWeekLaterDate = new Date(
    new Date().setDate(this.currentDate.getDate() + 7)
  );

  form = this.formBuilder.group({
    registrationCode: ['', [Validators.required, this.regexValidator]],
    dateToSend: [this.currentDate],
    registrationDate: { value: this.currentDate, disabled: true },
    documentCode: ['', [Validators.required, this.regexValidator]],
    deliveryType: 0,
    correspondentType: [0, Validators.required],
    topic: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', Validators.maxLength(1000)],
    deadline: [this.oneWeekLaterDate], // by default one week later
    isAvailable: false,
    isControlled: false,
    file: [null as File | null],
  });

  fileControlValue = toSignal(this.form.controls['file'].valueChanges, {
    initialValue: null,
  });

  private readonly registrationCodeControl =
    this.form.controls['registrationCode'];
  
  registrationCodeIsUnique = toSignal(
    this.registrationCodeControl.valueChanges.pipe(
      debounceTime(2500),
      filter(() => this.registrationCodeControl.valid),
      switchMap((registrationCode) =>
        this.documentsService.checkRegistrationCodeIsUnique(registrationCode)
      ),
      tap((isUnique) =>
        this.registrationCodeControl.setErrors(
          isUnique ? null : { notUnique: true }
        )
      ),
      map((isUnique) =>
        isUnique ? '' : 'В базе данных уже имеется данный номер.'
      )
    )
  );

  fileUploadText = computed(() => {
    const file = this.fileControlValue();
    if (file) return file.name;
    return 'Выберите или перетащите файл формата PDF, DOC, или DOCX';
  });

  onSelectedFileChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const newFile = inputElement.files?.[0];
    if (!newFile) return; // if user didn't upload a file, return early
    if (!this.validateUploadedFile(newFile)) {
      this.setFileValue(null); // file didn't pass validation, discard it
      return;
    }
    // check file name is unique and save it or discard it
    this.documentsService
      .checkFileNameIsUnique(newFile.name.toLocaleLowerCase())
      .subscribe((isUnique) => {
        if (isUnique) this.setFileValue(newFile);
        else {
          this.setFileValue(null);
          this.showSnackBarMessage(
            'Файл с данным названием уже имеется в реестре.'
          );
        }
      });
  }

  private validateUploadedFile(file: File): boolean {
    const fileName = file.name.toLowerCase();
    let errorMessage = '';
    if (
      !this.validateFileExtension(fileName) &&
      !this.validateFileSize(file.size)
    )
      errorMessage = 'Недопустимый формат и размер файла';
    else if (!this.validateFileExtension(fileName))
      errorMessage = 'Недопустимый формат';
    else if (!this.validateFileSize(file.size))
      errorMessage = 'Размер файла превышает 1Мб';

    if (errorMessage) {
      this.showSnackBarMessage(errorMessage);
      return false;
    }
    // if we are here, the file is valid
    return true;
  }

  private validateFileExtension(fileName: string): boolean {
    return Boolean(fileName.match(/\.(pdf|doc|docx)$/));
  }

  private validateFileSize(fileSize: number): boolean {
    return fileSize < 1024 * 1024; // must be less than 1MB
  }

  private showSnackBarMessage(message: string): void {
    this.snackBar.open(message, '', { duration: 3000 });
  }

  private setFileValue(file: File | null): void {
    this.form.controls['file'].setValue(file);
  }

  saveForm(): void {
    if (!this.validateForm()) return;
    const payload = this.form.getRawValue() as DocumentForm;
    this.documentsService
      .addDocument(payload)
      .subscribe((result) => {
        if (result.errorCode) {
          this.showSnackBarMessage("Что-то пошло не так с сохранением. Пожалуйста, попробуйте снова.")
          return;
        }
      });
  }

  private validateForm(): boolean {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.showSnackBarMessage('Заполните выделенные поля!');
      return false;
    }
    if (!this.fileControlValue()) {
      this.showSnackBarMessage('Необходимо загрузить файл.');
      return false;
    }
    return true;
  }
}
