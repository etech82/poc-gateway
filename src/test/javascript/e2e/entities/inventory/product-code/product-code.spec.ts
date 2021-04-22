import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../../page-objects/jhi-page-objects';

import { ProductCodeComponentsPage, ProductCodeDeleteDialog, ProductCodeUpdatePage } from './product-code.page-object';

const expect = chai.expect;

describe('ProductCode e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let productCodeComponentsPage: ProductCodeComponentsPage;
  let productCodeUpdatePage: ProductCodeUpdatePage;
  let productCodeDeleteDialog: ProductCodeDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.loginWithOAuth(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load ProductCodes', async () => {
    await navBarPage.goToEntity('product-code');
    productCodeComponentsPage = new ProductCodeComponentsPage();
    await browser.wait(ec.visibilityOf(productCodeComponentsPage.title), 5000);
    expect(await productCodeComponentsPage.getTitle()).to.eq('gatewayApp.inventoryProductCode.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(productCodeComponentsPage.entities), ec.visibilityOf(productCodeComponentsPage.noResult)),
      1000
    );
  });

  it('should load create ProductCode page', async () => {
    await productCodeComponentsPage.clickOnCreateButton();
    productCodeUpdatePage = new ProductCodeUpdatePage();
    expect(await productCodeUpdatePage.getPageTitle()).to.eq('gatewayApp.inventoryProductCode.home.createOrEditLabel');
    await productCodeUpdatePage.cancel();
  });

  it('should create and save ProductCodes', async () => {
    const nbButtonsBeforeCreate = await productCodeComponentsPage.countDeleteButtons();

    await productCodeComponentsPage.clickOnCreateButton();

    await promise.all([productCodeUpdatePage.setUpcInput('upc'), productCodeUpdatePage.setBarcodeInput('barcode')]);

    expect(await productCodeUpdatePage.getUpcInput()).to.eq('upc', 'Expected Upc value to be equals to upc');
    expect(await productCodeUpdatePage.getBarcodeInput()).to.eq('barcode', 'Expected Barcode value to be equals to barcode');

    await productCodeUpdatePage.save();
    expect(await productCodeUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await productCodeComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last ProductCode', async () => {
    const nbButtonsBeforeDelete = await productCodeComponentsPage.countDeleteButtons();
    await productCodeComponentsPage.clickOnLastDeleteButton();

    productCodeDeleteDialog = new ProductCodeDeleteDialog();
    expect(await productCodeDeleteDialog.getDialogTitle()).to.eq('gatewayApp.inventoryProductCode.delete.question');
    await productCodeDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(productCodeComponentsPage.title), 5000);

    expect(await productCodeComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
