export interface DocumentGridItem {
  fileName: string;
  registrationCode: string;
  registrationDate: Date;
  documentCode: string;
  dateToSend: Date;
  correspondentType: number;
  topic: string;
}

// reuse everything except correspondentType property, then redefine it as string
export interface DocumentGridItemDisplay
  extends Omit<DocumentGridItem, 'correspondentType'> {
  correspondentType: string;
}

export interface DocumentDetails extends DocumentGridItem {
  deliveryType: number;
  description: string;
  deadline: Date;
  isAvailable: boolean;
  isControlled: boolean;
}
