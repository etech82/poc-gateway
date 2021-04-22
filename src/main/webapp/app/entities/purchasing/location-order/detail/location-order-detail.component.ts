import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILocationOrder } from '../location-order.model';

@Component({
  selector: 'jhi-location-order-detail',
  templateUrl: './location-order-detail.component.html',
})
export class LocationOrderDetailComponent implements OnInit {
  locationOrder: ILocationOrder | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ locationOrder }) => {
      this.locationOrder = locationOrder;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
