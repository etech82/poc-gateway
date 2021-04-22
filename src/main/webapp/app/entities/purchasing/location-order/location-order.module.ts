import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { LocationOrderComponent } from './list/location-order.component';
import { LocationOrderDetailComponent } from './detail/location-order-detail.component';
import { LocationOrderUpdateComponent } from './update/location-order-update.component';
import { LocationOrderDeleteDialogComponent } from './delete/location-order-delete-dialog.component';
import { LocationOrderRoutingModule } from './route/location-order-routing.module';

@NgModule({
  imports: [SharedModule, LocationOrderRoutingModule],
  declarations: [LocationOrderComponent, LocationOrderDetailComponent, LocationOrderUpdateComponent, LocationOrderDeleteDialogComponent],
  entryComponents: [LocationOrderDeleteDialogComponent],
})
export class PurchasingLocationOrderModule {}
