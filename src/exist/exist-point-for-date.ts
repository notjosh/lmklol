import { ExistData, ExistDataPointValue } from './types';

export default (
  exist: ExistData[],
  attribute: string,
  date: string
): ExistDataPointValue => {
  if (exist == null) {
    return null;
  }

  const bits = exist.filter(bit => bit.attribute === attribute);

  if (bits.length === 0) {
    return null;
  }

  if (bits.length > 1) {
    console.warn(`found ${bits.length} attributes for ${attribute}`);
  }

  const bit = bits[0];

  const values = bit.values.filter(value => value.date === date);

  if (values.length === 0) {
    return null;
  }

  if (values.length > 1) {
    console.warn(
      `found ${values.length} attributes for ${attribute} on ${date}`
    );
  }

  return values[0].value;
};
