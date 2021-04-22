import { ILocation } from 'app/entities/purchasing/location/location.model';

export interface IAddress {
  id?: number;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  postcode?: string;
  country?: string;
  timezone?: string | null;
  latitude?: number;
  longitude?: number;
  location?: ILocation | null;
}

export class Address implements IAddress {
  constructor(
    public id?: number,
    public address1?: string | null,
    public address2?: string | null,
    public city?: string | null,
    public postcode?: string,
    public country?: string,
    public timezone?: string | null,
    public latitude?: number,
    public longitude?: number,
    public location?: ILocation | null
  ) {}
}

export function getAddressIdentifier(address: IAddress): number | undefined {
  return address.id;
}
