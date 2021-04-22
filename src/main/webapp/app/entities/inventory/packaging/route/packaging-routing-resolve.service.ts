import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPackaging, Packaging } from '../packaging.model';
import { PackagingService } from '../service/packaging.service';

@Injectable({ providedIn: 'root' })
export class PackagingRoutingResolveService implements Resolve<IPackaging> {
  constructor(protected service: PackagingService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPackaging> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((packaging: HttpResponse<Packaging>) => {
          if (packaging.body) {
            return of(packaging.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Packaging());
  }
}
