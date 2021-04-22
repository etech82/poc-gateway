import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILocationOrder, LocationOrder } from '../location-order.model';
import { LocationOrderService } from '../service/location-order.service';

@Injectable({ providedIn: 'root' })
export class LocationOrderRoutingResolveService implements Resolve<ILocationOrder> {
  constructor(protected service: LocationOrderService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILocationOrder> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((locationOrder: HttpResponse<LocationOrder>) => {
          if (locationOrder.body) {
            return of(locationOrder.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new LocationOrder());
  }
}
