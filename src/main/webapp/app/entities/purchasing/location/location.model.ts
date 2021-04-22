import { IAddress } from 'app/entities/purchasing/address/address.model';
import { ILocationOrder } from 'app/entities/purchasing/location-order/location-order.model';
import { LocationType } from 'app/entities/enumerations/location-type.model';

export interface ILocation {
  id?: number;
  locationNumber?: string;
  locationName?: string;
  location?: string | null;
  city?: string | null;
  state?: string | null;
  county?: string | null;
  phoneNumber?: number;
  pharmacyHours?: string;
  type?: LocationType;
  address?: IAddress | null;
  orders?: ILocationOrder[] | null;
}

export class Location implements ILocation {
  constructor(
    public id?: number,
    public locationNumber?: string,
    public locationName?: string,
    public location?: string | null,
    public city?: string | null,
    public state?: string | null,
    public county?: string | null,
    public phoneNumber?: number,
    public pharmacyHours?: string,
    public type?: LocationType,
    public address?: IAddress | null,
    public orders?: ILocationOrder[] | null
  ) {}
}

export function getLocationIdentifier(location: ILocation): number | undefined {
  return location.id;
}
