export enum DeliveryType {
  Courier,
  Email,
  Telegram,
}

export const DELIVERY_TYPES = [
  { name: 'Курьер', code: DeliveryType.Courier },
  { name: 'Email', code: DeliveryType.Email },
  { name: 'Телефонограмма', code: DeliveryType.Telegram },
];