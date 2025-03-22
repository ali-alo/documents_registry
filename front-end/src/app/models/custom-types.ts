export const CORRESPONDENT_TYPES = [
  { code: 1, name: 'ЦБ' },
  { code: 2, name: 'ГНИ' },
  { code: 3, name: 'ТСЖ' },
];

export function getCorrespondentTypeName(value: number): string {
  return (
    CORRESPONDENT_TYPES.find((type) => type.code === value)?.name || ''
  );
}

export const DELIVERY_TYPES = [
  { code: 1, name: 'Курьер' },
  { code: 2, name: 'Email' },
  { code: 3, name: 'Телефонограмма' },
];


export function getDeliveryTypeName(value: number): string {
  return DELIVERY_TYPES.find((type) => type.code === value)?.name || '';
}