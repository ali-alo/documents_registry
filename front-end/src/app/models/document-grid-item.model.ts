export interface DocumentGridItem {
  fileName: string;
  registrationCode: string;
  registrationDate: Date;
  documentCode: string;
  dateToSend: Date;
  correspondentType: number;
  topic: string;
}

export interface DocumentDetails extends DocumentGridItem {
  deliveryType: number;
  description: string;
  deadline: Date;
  isAvailable: boolean;
  isControlled: boolean;
}