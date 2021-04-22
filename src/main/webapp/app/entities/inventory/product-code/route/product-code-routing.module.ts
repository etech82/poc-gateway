import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ProductCodeComponent } from '../list/product-code.component';
import { ProductCodeDetailComponent } from '../detail/product-code-detail.component';
import { ProductCodeUpdateComponent } from '../update/product-code-update.component';
import { ProductCodeRoutingResolveService } from './product-code-routing-resolve.service';

const productCodeRoute: Routes = [
  {
    path: '',
    component: ProductCodeComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProductCodeDetailComponent,
    resolve: {
      productCode: ProductCodeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProductCodeUpdateComponent,
    resolve: {
      productCode: ProductCodeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProductCodeUpdateComponent,
    resolve: {
      productCode: ProductCodeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(productCodeRoute)],
  exports: [RouterModule],
})
export class ProductCodeRoutingModule {}
