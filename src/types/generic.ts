export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Maybe<T> = T | null;

export type SelectOptions<T> = {
  label: string;
  value: T
}