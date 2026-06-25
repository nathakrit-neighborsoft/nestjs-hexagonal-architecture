export interface GetAllParamsType {
  search?: string;
  sort?: string;
  order?: string;
  page?: number;
  limit?: number;
}

export interface GetAllMetaType {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export enum EStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted',
}

export type Brand<K, T> = K & { readonly __brand: T };
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type CreatedAt = Brand<Date, 'CreatedAt'>;
export type UpdatedAt = Brand<Date, 'UpdatedAt'>;

export type Status = Brand<EStatus, 'Status'>;
