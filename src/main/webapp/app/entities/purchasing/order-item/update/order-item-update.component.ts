import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IOrderItem, OrderItem } from '../order-item.model';
import { OrderItemService } from '../service/order-item.service';
import { ILocationOrder } from 'app/entities/purchasing/location-order/location-order.model';
import { LocationOrderService } from 'app/entities/purchasing/location-order/service/location-order.service';

@Component({
  selector: 'jhi-order-item-update',
  templateUrl: './order-item-update.component.html',
})
export class OrderItemUpdateComponent implements OnInit {
  isSaving = false;

  locationOrdersSharedCollection: ILocationOrder[] = [];

  editForm = this.fb.group({
    id: [],
    quantity: [null, [Validators.required, Validators.min(0)]],
    totalPrice: [null, [Validators.required, Validators.min(0)]],
    status: [null, [Validators.required]],
    locationOrder: [],
  });

  constructor(
    protected orderItemService: OrderItemService,
    protected locationOrderService: LocationOrderService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ orderItem }) => {
      this.updateForm(orderItem);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const orderItem = this.createFromForm();
    if (orderItem.id !== undefined) {
      this.subscribeToSaveResponse(this.orderItemService.update(orderItem));
    } else {
      this.subscribeToSaveResponse(this.orderItemService.create(orderItem));
    }
  }

  trackLocationOrderById(index: number, item: ILocationOrder): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrderItem>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(orderItem: IOrderItem): void {
    this.editForm.patchValue({
      id: orderItem.id,
      quantity: orderItem.quantity,
      totalPrice: orderItem.totalPrice,
      status: orderItem.status,
      locationOrder: orderItem.locationOrder,
    });

    this.locationOrdersSharedCollection = this.locationOrderService.addLocationOrderToCollectionIfMissing(
      this.locationOrdersSharedCollection,
      orderItem.locationOrder
    );
  }

  protected loadRelationshipsOptions(): void {
    this.locationOrderService
      .query()
      .pipe(map((res: HttpResponse<ILocationOrder[]>) => res.body ?? []))
      .pipe(
        map((locationOrders: ILocationOrder[]) =>
          this.locationOrderService.addLocationOrderToCollectionIfMissing(locationOrders, this.editForm.get('locationOrder')!.value)
        )
      )
      .subscribe((locationOrders: ILocationOrder[]) => (this.locationOrdersSharedCollection = locationOrders));
  }

  protected createFromForm(): IOrderItem {
    return {
      ...new OrderItem(),
      id: this.editForm.get(['id'])!.value,
      quantity: this.editForm.get(['quantity'])!.value,
      totalPrice: this.editForm.get(['totalPrice'])!.value,
      status: this.editForm.get(['status'])!.value,
      locationOrder: this.editForm.get(['locationOrder'])!.value,
    };
  }
}
