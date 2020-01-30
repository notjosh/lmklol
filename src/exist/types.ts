export type ExistDataPointValue = number | string | null;

export type ExistDataPoint = {
  value: ExistDataPointValue;
  date: string;
};

export type ExistData = {
  group: { name: string; label: string; priority: number };
  attribute: string;
  label: string;
  private: boolean;
  priority: number;
  value_type: number;
  value_type_description: string;
  service: string;
  values: ExistDataPoint[];
};
