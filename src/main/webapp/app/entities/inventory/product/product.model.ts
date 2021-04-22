import { IProductCode } from 'app/entities/inventory/product-code/product-code.model';
import { ICategory } from 'app/entities/inventory/category/category.model';
import { IPackaging } from 'app/entities/inventory/packaging/packaging.model';
import { ICatalog } from 'app/entities/inventory/catalog/catalog.model';
import { ProductType } from 'app/entities/enumerations/product-type.model';
import { StorageType } from 'app/entities/enumerations/storage-type.model';
import { UnitOfMeasurement } from 'app/entities/enumerations/unit-of-measurement.model';
import { ProductStatus } from 'app/entities/enumerations/product-status.model';

export interface IProduct {
  id?: number;
  name?: string;
  description?: string | null;
  company?: string | null;
  type?: ProductType;
  storageType?: StorageType;
  price?: number;
  salesUnit?: UnitOfMeasurement | null;
  salesQuantity?: number | null;
  imageContentType?: string | null;
  image?: string | null;
  status?: ProductStatus | null;
  productCode?: IProductCode | null;
  category?: ICategory | null;
  packaging?: IPackaging | null;
  catalogs?: ICatalog[] | null;
}

export class Product implements IProduct {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string | null,
    public company?: string | null,
    public type?: ProductType,
    public storageType?: StorageType,
    public price?: number,
    public salesUnit?: UnitOfMeasurement | null,
    public salesQuantity?: number | null,
    public imageContentType?: string | null,
    public image?: string | null,
    public status?: ProductStatus | null,
    public productCode?: IProductCode | null,
    public category?: ICategory | null,
    public packaging?: IPackaging | null,
    public catalogs?: ICatalog[] | null
  ) {}
}

export function getProductIdentifier(product: IProduct): number | undefined {
  return product.id;
}
