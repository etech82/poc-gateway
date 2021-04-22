import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../../page-objects/jhi-page-objects';

import { LocationComponentsPage, LocationDeleteDialog, LocationUpdatePage } from './location.page-object';

const expect = chai.expect;

describe('Location e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let locationComponentsPage: LocationComponentsPage;
  let locationUpdatePage: LocationUpdatePage;
  let locationDeleteDialog: LocationDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.loginWithOAuth(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Locations', async () => {
    await navBarPage.goToEntity('location');
    locationComponentsPage = new LocationComponentsPage();
    await browser.wait(ec.visibilityOf(locationComponentsPage.title), 5000);
    expect(await locationComponentsPage.getTitle()).to.eq('gatewayApp.purchasingLocation.home.title');
    await browser.wait(ec.or(ec.visibilityOf(locationComponentsPage.entities), ec.visibilityOf(locationComponentsPage.noResult)), 1000);
  });

  it('should load create Location page', async () => {
    await locationComponentsPage.clickOnCreateButton();
    locationUpdatePage = new LocationUpdatePage();
    expect(await locationUpdatePage.getPageTitle()).to.eq('gatewayApp.purchasingLocation.home.createOrEditLabel');
    await locationUpdatePage.cancel();
  });

  it('should create and save Locations', async () => {
    const nbButtonsBeforeCreate = await locationComponentsPage.countDeleteButtons();

    await locationComponentsPage.clickOnCreateButton();

    await promise.all([
      locationUpdatePage.setLocationNumberInput('64c99148-3908-465d-8c4a-e510e3ade974'),
      locationUpdatePage.setLocationNameInput('locationName'),
      locationUpdatePage.setLocationInput('location'),
      locationUpdatePage.setCityInput('city'),
      locationUpdatePage.setStateInput('state'),
      locationUpdatePage.setCountyInput('county'),
      locationUpdatePage.setPhoneNumberInput('5'),
      locationUpdatePage.setPharmacyHoursInput('pharmacyHours'),
      locationUpdatePage.typeSelectLastOption(),
      locationUpdatePage.addressSelectLastOption(),
    ]);

    expect(await locationUpdatePage.getLocationNumberInput()).to.eq(
      '64c99148-3908-465d-8c4a-e510e3ade974',
      'Expected LocationNumber value to be equals to 64c99148-3908-465d-8c4a-e510e3ade974'
    );
    expect(await locationUpdatePage.getLocationNameInput()).to.eq(
      'locationName',
      'Expected LocationName value to be equals to locationName'
    );
    expect(await locationUpdatePage.getLocationInput()).to.eq('location', 'Expected Location value to be equals to location');
    expect(await locationUpdatePage.getCityInput()).to.eq('city', 'Expected City value to be equals to city');
    expect(await locationUpdatePage.getStateInput()).to.eq('state', 'Expected State value to be equals to state');
    expect(await locationUpdatePage.getCountyInput()).to.eq('county', 'Expected County value to be equals to county');
    expect(await locationUpdatePage.getPhoneNumberInput()).to.eq('5', 'Expected phoneNumber value to be equals to 5');
    expect(await locationUpdatePage.getPharmacyHoursInput()).to.eq(
      'pharmacyHours',
      'Expected PharmacyHours value to be equals to pharmacyHours'
    );

    await locationUpdatePage.save();
    expect(await locationUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await locationComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Location', async () => {
    const nbButtonsBeforeDelete = await locationComponentsPage.countDeleteButtons();
    await locationComponentsPage.clickOnLastDeleteButton();

    locationDeleteDialog = new LocationDeleteDialog();
    expect(await locationDeleteDialog.getDialogTitle()).to.eq('gatewayApp.purchasingLocation.delete.question');
    await locationDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(locationComponentsPage.title), 5000);

    expect(await locationComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
