export interface DocumentGridItem {
  fileName: string;
  registrationCode: string;
  registrationDate: Date;
  documentCode: string;
  dateToSend: Date;
  correspondentType: 0 | 1 | 2;
  topic: string;
}