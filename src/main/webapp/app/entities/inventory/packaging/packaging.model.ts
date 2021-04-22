import { IProduct } from 'app/entities/inventory/product/product.model';

export interface IPackaging {
  id?: number;
  name?: string;
  quantity?: number;
  grosWeight?: number | null;
  netWeight?: number | null;
  length?: number | null;
  width?: number | null;
  height?: number | null;
  products?: IProduct[] | null;
}

export class Packaging implements IPackaging {
  constructor(
    public id?: number,
    public name?: string,
    public quantity?: number,
    public grosWeight?: number | null,
    public netWeight?: number | null,
    public length?: number | null,
    public width?: number | null,
    public height?: number | null,
    public products?: IProduct[] | null
  ) {}
}

export function getPackagingIdentifier(packaging: IPackaging): number | undefined {
  return packaging.id;
}
