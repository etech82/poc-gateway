import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../../page-objects/jhi-page-objects';

import { AddressComponentsPage, AddressDeleteDialog, AddressUpdatePage } from './address.page-object';

const expect = chai.expect;

describe('Address e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let addressComponentsPage: AddressComponentsPage;
  let addressUpdatePage: AddressUpdatePage;
  let addressDeleteDialog: AddressDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.loginWithOAuth(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Addresses', async () => {
    await navBarPage.goToEntity('address');
    addressComponentsPage = new AddressComponentsPage();
    await browser.wait(ec.visibilityOf(addressComponentsPage.title), 5000);
    expect(await addressComponentsPage.getTitle()).to.eq('gatewayApp.purchasingAddress.home.title');
    await browser.wait(ec.or(ec.visibilityOf(addressComponentsPage.entities), ec.visibilityOf(addressComponentsPage.noResult)), 1000);
  });

  it('should load create Address page', async () => {
    await addressComponentsPage.clickOnCreateButton();
    addressUpdatePage = new AddressUpdatePage();
    expect(await addressUpdatePage.getPageTitle()).to.eq('gatewayApp.purchasingAddress.home.createOrEditLabel');
    await addressUpdatePage.cancel();
  });

  it('should create and save Addresses', async () => {
    const nbButtonsBeforeCreate = await addressComponentsPage.countDeleteButtons();

    await addressComponentsPage.clickOnCreateButton();

    await promise.all([
      addressUpdatePage.setAddress1Input('address1'),
      addressUpdatePage.setAddress2Input('address2'),
      addressUpdatePage.setCityInput('city'),
      addressUpdatePage.setPostcodeInput('postcode'),
      addressUpdatePage.setCountryInput('country'),
      addressUpdatePage.setTimezoneInput('timezone'),
      addressUpdatePage.setLatitudeInput('5'),
      addressUpdatePage.setLongitudeInput('5'),
    ]);

    expect(await addressUpdatePage.getAddress1Input()).to.eq('address1', 'Expected Address1 value to be equals to address1');
    expect(await addressUpdatePage.getAddress2Input()).to.eq('address2', 'Expected Address2 value to be equals to address2');
    expect(await addressUpdatePage.getCityInput()).to.eq('city', 'Expected City value to be equals to city');
    expect(await addressUpdatePage.getPostcodeInput()).to.eq('postcode', 'Expected Postcode value to be equals to postcode');
    expect(await addressUpdatePage.getCountryInput()).to.eq('country', 'Expected Country value to be equals to country');
    expect(await addressUpdatePage.getTimezoneInput()).to.eq('timezone', 'Expected Timezone value to be equals to timezone');
    expect(await addressUpdatePage.getLatitudeInput()).to.eq('5', 'Expected latitude value to be equals to 5');
    expect(await addressUpdatePage.getLongitudeInput()).to.eq('5', 'Expected longitude value to be equals to 5');

    await addressUpdatePage.save();
    expect(await addressUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await addressComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Address', async () => {
    const nbButtonsBeforeDelete = await addressComponentsPage.countDeleteButtons();
    await addressComponentsPage.clickOnLastDeleteButton();

    addressDeleteDialog = new AddressDeleteDialog();
    expect(await addressDeleteDialog.getDialogTitle()).to.eq('gatewayApp.purchasingAddress.delete.question');
    await addressDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(addressComponentsPage.title), 5000);

    expect(await addressComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
