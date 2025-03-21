import { CorrespondentType } from "../enums/correspondent.enum";

export interface DocumentForm {
  fileName: string;
  registrationCode: string;
  registrationDate: Date;
  documentCode: string;
  dateToSend: Date;
  correspondentType: CorrespondentType;
  topic: string;
}