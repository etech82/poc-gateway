import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IProductCode, ProductCode } from '../product-code.model';
import { ProductCodeService } from '../service/product-code.service';

@Injectable({ providedIn: 'root' })
export class ProductCodeRoutingResolveService implements Resolve<IProductCode> {
  constructor(protected service: ProductCodeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProductCode> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((productCode: HttpResponse<ProductCode>) => {
          if (productCode.body) {
            return of(productCode.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ProductCode());
  }
}
