export interface DocumentForm {
  registrationCode: string;
  registrationDate: Date;
  documentCode: string;
  dateToSend: Date;
  deliveryType: 0 | 1 | 2;
  correspondentType: 0 | 1 | 2;
  topic: string;
  description: string;
  deadline: Date;
  isAvailable: boolean;
  isControlled: boolean;
  file: File;
}
