import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ILocationOrder } from '../location-order.model';
import { LocationOrderService } from '../service/location-order.service';
import { LocationOrderDeleteDialogComponent } from '../delete/location-order-delete-dialog.component';

@Component({
  selector: 'jhi-location-order',
  templateUrl: './location-order.component.html',
})
export class LocationOrderComponent implements OnInit {
  locationOrders?: ILocationOrder[];
  isLoading = false;

  constructor(protected locationOrderService: LocationOrderService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.locationOrderService.query().subscribe(
      (res: HttpResponse<ILocationOrder[]>) => {
        this.isLoading = false;
        this.locationOrders = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ILocationOrder): number {
    return item.id!;
  }

  delete(locationOrder: ILocationOrder): void {
    const modalRef = this.modalService.open(LocationOrderDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.locationOrder = locationOrder;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
