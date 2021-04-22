import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILocationOrder, getLocationOrderIdentifier } from '../location-order.model';

export type EntityResponseType = HttpResponse<ILocationOrder>;
export type EntityArrayResponseType = HttpResponse<ILocationOrder[]>;

@Injectable({ providedIn: 'root' })
export class LocationOrderService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/location-orders', 'purchasing');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(locationOrder: ILocationOrder): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(locationOrder);
    return this.http
      .post<ILocationOrder>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(locationOrder: ILocationOrder): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(locationOrder);
    return this.http
      .put<ILocationOrder>(`${this.resourceUrl}/${getLocationOrderIdentifier(locationOrder) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(locationOrder: ILocationOrder): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(locationOrder);
    return this.http
      .patch<ILocationOrder>(`${this.resourceUrl}/${getLocationOrderIdentifier(locationOrder) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ILocationOrder>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ILocationOrder[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addLocationOrderToCollectionIfMissing(
    locationOrderCollection: ILocationOrder[],
    ...locationOrdersToCheck: (ILocationOrder | null | undefined)[]
  ): ILocationOrder[] {
    const locationOrders: ILocationOrder[] = locationOrdersToCheck.filter(isPresent);
    if (locationOrders.length > 0) {
      const locationOrderCollectionIdentifiers = locationOrderCollection.map(
        locationOrderItem => getLocationOrderIdentifier(locationOrderItem)!
      );
      const locationOrdersToAdd = locationOrders.filter(locationOrderItem => {
        const locationOrderIdentifier = getLocationOrderIdentifier(locationOrderItem);
        if (locationOrderIdentifier == null || locationOrderCollectionIdentifiers.includes(locationOrderIdentifier)) {
          return false;
        }
        locationOrderCollectionIdentifiers.push(locationOrderIdentifier);
        return true;
      });
      return [...locationOrdersToAdd, ...locationOrderCollection];
    }
    return locationOrderCollection;
  }

  protected convertDateFromClient(locationOrder: ILocationOrder): ILocationOrder {
    return Object.assign({}, locationOrder, {
      placedDate: locationOrder.placedDate?.isValid() ? locationOrder.placedDate.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.placedDate = res.body.placedDate ? dayjs(res.body.placedDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((locationOrder: ILocationOrder) => {
        locationOrder.placedDate = locationOrder.placedDate ? dayjs(locationOrder.placedDate) : undefined;
      });
    }
    return res;
  }
}
