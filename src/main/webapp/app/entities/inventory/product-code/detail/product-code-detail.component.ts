import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProductCode } from '../product-code.model';

@Component({
  selector: 'jhi-product-code-detail',
  templateUrl: './product-code-detail.component.html',
})
export class ProductCodeDetailComponent implements OnInit {
  productCode: IProductCode | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ productCode }) => {
      this.productCode = productCode;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
