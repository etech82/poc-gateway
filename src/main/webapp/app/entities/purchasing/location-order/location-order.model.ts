import * as dayjs from 'dayjs';
import { IOrderItem } from 'app/entities/purchasing/order-item/order-item.model';
import { ILocation } from 'app/entities/purchasing/location/location.model';
import { OrderStatus } from 'app/entities/enumerations/order-status.model';

export interface ILocationOrder {
  id?: number;
  code?: string;
  placedDate?: dayjs.Dayjs;
  status?: OrderStatus;
  invoiceId?: number | null;
  orderItems?: IOrderItem[] | null;
  location?: ILocation | null;
}

export class LocationOrder implements ILocationOrder {
  constructor(
    public id?: number,
    public code?: string,
    public placedDate?: dayjs.Dayjs,
    public status?: OrderStatus,
    public invoiceId?: number | null,
    public orderItems?: IOrderItem[] | null,
    public location?: ILocation | null
  ) {}
}

export function getLocationOrderIdentifier(locationOrder: ILocationOrder): number | undefined {
  return locationOrder.id;
}
