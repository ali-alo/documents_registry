import { Component, computed, inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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
  private readonly formBuilder = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);

  private readonly atLeastOneDigitRegEx =
    /([0-9]+)|([A-Яa-я]+[^A-Яa-я0-9]+)|([^A-Яa-я0-9]+[A-Яa-я]+)/;
  private readonly regexValidator = Validators.pattern(
    this.atLeastOneDigitRegEx
  );

  readonly deliveryTypes = [
    { name: 'Курьер', code: 0 },
    { name: 'Email', code: 1 },
    { name: 'Телефонограмма', code: 2 },
  ];

  readonly correspondentTypes = [
    { name: 'ЦБ', code: 0 },
    { name: 'ГНИ', code: 1 },
    { name: 'ТСЖ', code: 2 },
  ];

  currentDate = new Date();
  oneWeekLaterDate = new Date(
    new Date().setDate(this.currentDate.getDate() + 7)
  );

  form = this.formBuilder.group({
    registrationCode: ['', [Validators.required, this.regexValidator]],
    registrationDate: { value: this.currentDate, disabled: true },
    documentCode: ['', [Validators.required, this.regexValidator]],
    deliveryType: '',
    correspondentType: ['', Validators.required],
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

  fileUploadText = computed(() => {
    const file = this.fileControlValue();
    if (file) return file.name;
    return 'Выберите или перетащите файл формата PDF, DOC, или DOCX';
  });

  onSelectedFileChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const newFile = inputElement.files?.[0];
    if (!newFile) return; // if user didn't upload a file, return early
    !this.validateUploadedFile(newFile)
      ? this.setFileValue(null) // file didn't pass validation, discard it
      : this.setFileValue(newFile); // save valid file and later send it to back-end
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
    if (!this.validateForm())
      return;
    // send request to the back-end here
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
