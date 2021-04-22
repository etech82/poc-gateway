import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../../page-objects/jhi-page-objects';

import { PackagingComponentsPage, PackagingDeleteDialog, PackagingUpdatePage } from './packaging.page-object';

const expect = chai.expect;

describe('Packaging e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let packagingComponentsPage: PackagingComponentsPage;
  let packagingUpdatePage: PackagingUpdatePage;
  let packagingDeleteDialog: PackagingDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.loginWithOAuth(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Packagings', async () => {
    await navBarPage.goToEntity('packaging');
    packagingComponentsPage = new PackagingComponentsPage();
    await browser.wait(ec.visibilityOf(packagingComponentsPage.title), 5000);
    expect(await packagingComponentsPage.getTitle()).to.eq('gatewayApp.inventoryPackaging.home.title');
    await browser.wait(ec.or(ec.visibilityOf(packagingComponentsPage.entities), ec.visibilityOf(packagingComponentsPage.noResult)), 1000);
  });

  it('should load create Packaging page', async () => {
    await packagingComponentsPage.clickOnCreateButton();
    packagingUpdatePage = new PackagingUpdatePage();
    expect(await packagingUpdatePage.getPageTitle()).to.eq('gatewayApp.inventoryPackaging.home.createOrEditLabel');
    await packagingUpdatePage.cancel();
  });

  it('should create and save Packagings', async () => {
    const nbButtonsBeforeCreate = await packagingComponentsPage.countDeleteButtons();

    await packagingComponentsPage.clickOnCreateButton();

    await promise.all([
      packagingUpdatePage.setNameInput('name'),
      packagingUpdatePage.setQuantityInput('5'),
      packagingUpdatePage.setGrosWeightInput('5'),
      packagingUpdatePage.setNetWeightInput('5'),
      packagingUpdatePage.setLengthInput('5'),
      packagingUpdatePage.setWidthInput('5'),
      packagingUpdatePage.setHeightInput('5'),
    ]);

    expect(await packagingUpdatePage.getNameInput()).to.eq('name', 'Expected Name value to be equals to name');
    expect(await packagingUpdatePage.getQuantityInput()).to.eq('5', 'Expected quantity value to be equals to 5');
    expect(await packagingUpdatePage.getGrosWeightInput()).to.eq('5', 'Expected grosWeight value to be equals to 5');
    expect(await packagingUpdatePage.getNetWeightInput()).to.eq('5', 'Expected netWeight value to be equals to 5');
    expect(await packagingUpdatePage.getLengthInput()).to.eq('5', 'Expected length value to be equals to 5');
    expect(await packagingUpdatePage.getWidthInput()).to.eq('5', 'Expected width value to be equals to 5');
    expect(await packagingUpdatePage.getHeightInput()).to.eq('5', 'Expected height value to be equals to 5');

    await packagingUpdatePage.save();
    expect(await packagingUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await packagingComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Packaging', async () => {
    const nbButtonsBeforeDelete = await packagingComponentsPage.countDeleteButtons();
    await packagingComponentsPage.clickOnLastDeleteButton();

    packagingDeleteDialog = new PackagingDeleteDialog();
    expect(await packagingDeleteDialog.getDialogTitle()).to.eq('gatewayApp.inventoryPackaging.delete.question');
    await packagingDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(packagingComponentsPage.title), 5000);

    expect(await packagingComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
