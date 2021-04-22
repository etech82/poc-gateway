import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../../page-objects/jhi-page-objects';

import { LocationOrderComponentsPage, LocationOrderDeleteDialog, LocationOrderUpdatePage } from './location-order.page-object';

const expect = chai.expect;

describe('LocationOrder e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let locationOrderComponentsPage: LocationOrderComponentsPage;
  let locationOrderUpdatePage: LocationOrderUpdatePage;
  let locationOrderDeleteDialog: LocationOrderDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.loginWithOAuth(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load LocationOrders', async () => {
    await navBarPage.goToEntity('location-order');
    locationOrderComponentsPage = new LocationOrderComponentsPage();
    await browser.wait(ec.visibilityOf(locationOrderComponentsPage.title), 5000);
    expect(await locationOrderComponentsPage.getTitle()).to.eq('gatewayApp.purchasingLocationOrder.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(locationOrderComponentsPage.entities), ec.visibilityOf(locationOrderComponentsPage.noResult)),
      1000
    );
  });

  it('should load create LocationOrder page', async () => {
    await locationOrderComponentsPage.clickOnCreateButton();
    locationOrderUpdatePage = new LocationOrderUpdatePage();
    expect(await locationOrderUpdatePage.getPageTitle()).to.eq('gatewayApp.purchasingLocationOrder.home.createOrEditLabel');
    await locationOrderUpdatePage.cancel();
  });

  it('should create and save LocationOrders', async () => {
    const nbButtonsBeforeCreate = await locationOrderComponentsPage.countDeleteButtons();

    await locationOrderComponentsPage.clickOnCreateButton();

    await promise.all([
      locationOrderUpdatePage.setCodeInput('64c99148-3908-465d-8c4a-e510e3ade974'),
      locationOrderUpdatePage.setPlacedDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      locationOrderUpdatePage.statusSelectLastOption(),
      locationOrderUpdatePage.setInvoiceIdInput('5'),
      locationOrderUpdatePage.locationSelectLastOption(),
    ]);

    expect(await locationOrderUpdatePage.getCodeInput()).to.eq(
      '64c99148-3908-465d-8c4a-e510e3ade974',
      'Expected Code value to be equals to 64c99148-3908-465d-8c4a-e510e3ade974'
    );
    expect(await locationOrderUpdatePage.getPlacedDateInput()).to.contain(
      '2001-01-01T02:30',
      'Expected placedDate value to be equals to 2000-12-31'
    );
    expect(await locationOrderUpdatePage.getInvoiceIdInput()).to.eq('5', 'Expected invoiceId value to be equals to 5');

    await locationOrderUpdatePage.save();
    expect(await locationOrderUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await locationOrderComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last LocationOrder', async () => {
    const nbButtonsBeforeDelete = await locationOrderComponentsPage.countDeleteButtons();
    await locationOrderComponentsPage.clickOnLastDeleteButton();

    locationOrderDeleteDialog = new LocationOrderDeleteDialog();
    expect(await locationOrderDeleteDialog.getDialogTitle()).to.eq('gatewayApp.purchasingLocationOrder.delete.question');
    await locationOrderDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(locationOrderComponentsPage.title), 5000);

    expect(await locationOrderComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
