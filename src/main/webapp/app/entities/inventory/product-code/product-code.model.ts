import { IProduct } from 'app/entities/inventory/product/product.model';

export interface IProductCode {
  id?: number;
  upc?: string;
  barcode?: string | null;
  product?: IProduct | null;
}

export class ProductCode implements IProductCode {
  constructor(public id?: number, public upc?: string, public barcode?: string | null, public product?: IProduct | null) {}
}

export function getProductCodeIdentifier(productCode: IProductCode): number | undefined {
  return productCode.id;
}
