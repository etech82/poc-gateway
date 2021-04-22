import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IProductCode } from '../product-code.model';
import { ProductCodeService } from '../service/product-code.service';
import { ProductCodeDeleteDialogComponent } from '../delete/product-code-delete-dialog.component';

@Component({
  selector: 'jhi-product-code',
  templateUrl: './product-code.component.html',
})
export class ProductCodeComponent implements OnInit {
  productCodes?: IProductCode[];
  isLoading = false;

  constructor(protected productCodeService: ProductCodeService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.productCodeService.query().subscribe(
      (res: HttpResponse<IProductCode[]>) => {
        this.isLoading = false;
        this.productCodes = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IProductCode): number {
    return item.id!;
  }

  delete(productCode: IProductCode): void {
    const modalRef = this.modalService.open(ProductCodeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.productCode = productCode;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
