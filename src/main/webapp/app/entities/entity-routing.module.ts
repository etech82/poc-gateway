import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'address',
        data: { pageTitle: 'gatewayApp.purchasingAddress.home.title' },
        loadChildren: () => import('./purchasing/address/address.module').then(m => m.PurchasingAddressModule),
      },
      {
        path: 'catalog',
        data: { pageTitle: 'gatewayApp.inventoryCatalog.home.title' },
        loadChildren: () => import('./inventory/catalog/catalog.module').then(m => m.InventoryCatalogModule),
      },
      {
        path: 'category',
        data: { pageTitle: 'gatewayApp.inventoryCategory.home.title' },
        loadChildren: () => import('./inventory/category/category.module').then(m => m.InventoryCategoryModule),
      },
      {
        path: 'location',
        data: { pageTitle: 'gatewayApp.purchasingLocation.home.title' },
        loadChildren: () => import('./purchasing/location/location.module').then(m => m.PurchasingLocationModule),
      },
      {
        path: 'location-order',
        data: { pageTitle: 'gatewayApp.purchasingLocationOrder.home.title' },
        loadChildren: () => import('./purchasing/location-order/location-order.module').then(m => m.PurchasingLocationOrderModule),
      },
      {
        path: 'notification',
        data: { pageTitle: 'gatewayApp.notificationNotification.home.title' },
        loadChildren: () => import('./notification/notification/notification.module').then(m => m.NotificationNotificationModule),
      },
      {
        path: 'order-item',
        data: { pageTitle: 'gatewayApp.purchasingOrderItem.home.title' },
        loadChildren: () => import('./purchasing/order-item/order-item.module').then(m => m.PurchasingOrderItemModule),
      },
      {
        path: 'packaging',
        data: { pageTitle: 'gatewayApp.inventoryPackaging.home.title' },
        loadChildren: () => import('./inventory/packaging/packaging.module').then(m => m.InventoryPackagingModule),
      },
      {
        path: 'product',
        data: { pageTitle: 'gatewayApp.inventoryProduct.home.title' },
        loadChildren: () => import('./inventory/product/product.module').then(m => m.InventoryProductModule),
      },
      {
        path: 'product-code',
        data: { pageTitle: 'gatewayApp.inventoryProductCode.home.title' },
        loadChildren: () => import('./inventory/product-code/product-code.module').then(m => m.InventoryProductCodeModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
