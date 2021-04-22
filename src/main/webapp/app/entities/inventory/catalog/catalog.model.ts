import { IProduct } from 'app/entities/inventory/product/product.model';
import { CatalogStatus } from 'app/entities/enumerations/catalog-status.model';

export interface ICatalog {
  id?: number;
  code?: string;
  status?: CatalogStatus;
  productCodes?: IProduct[] | null;
}

export class Catalog implements ICatalog {
  constructor(public id?: number, public code?: string, public status?: CatalogStatus, public productCodes?: IProduct[] | null) {}
}

export function getCatalogIdentifier(catalog: ICatalog): number | undefined {
  return catalog.id;
}
