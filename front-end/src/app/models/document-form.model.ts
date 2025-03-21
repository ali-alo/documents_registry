import { CorrespondentType } from '../enums/correspondent.enum';
import { DeliveryType } from '../enums/delivery.enum';

export interface DocumentForm {
  registrationCode: string;
  registrationDate: Date;
  documentCode: string;
  deliveryType: DeliveryType;
  correspondentType: CorrespondentType;
  topic: string;
  description: string;
  deadline: Date;
  isAvailable: boolean;
  isControlled: boolean;
  file: File | null;
}
