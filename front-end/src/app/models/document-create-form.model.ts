export interface DocumentCreateForm {
  registrationCode: string;
  registrationDate: Date;
  documentCode: string;
  dateToSend: Date;
  deliveryType: number;
  correspondentType: number;
  topic: string;
  description: string;
  deadline: Date;
  isAvailable: boolean;
  isControlled: boolean;
  file: File;
}
