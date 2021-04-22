import { IProduct } from 'app/entities/inventory/product/product.model';

export interface ICategory {
  id?: number;
  name?: string;
  description?: string | null;
  products?: IProduct[] | null;
}

export class Category implements ICategory {
  constructor(public id?: number, public name?: string, public description?: string | null, public products?: IProduct[] | null) {}
}

export function getCategoryIdentifier(category: ICategory): number | undefined {
  return category.id;
}
