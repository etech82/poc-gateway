import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILocationOrder } from '../location-order.model';
import { LocationOrderService } from '../service/location-order.service';

@Component({
  templateUrl: './location-order-delete-dialog.component.html',
})
export class LocationOrderDeleteDialogComponent {
  locationOrder?: ILocationOrder;

  constructor(protected locationOrderService: LocationOrderService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.locationOrderService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
