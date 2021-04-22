import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../../page-objects/jhi-page-objects';

import { CatalogComponentsPage, CatalogDeleteDialog, CatalogUpdatePage } from './catalog.page-object';

const expect = chai.expect;

describe('Catalog e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let catalogComponentsPage: CatalogComponentsPage;
  let catalogUpdatePage: CatalogUpdatePage;
  let catalogDeleteDialog: CatalogDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.loginWithOAuth(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Catalogs', async () => {
    await navBarPage.goToEntity('catalog');
    catalogComponentsPage = new CatalogComponentsPage();
    await browser.wait(ec.visibilityOf(catalogComponentsPage.title), 5000);
    expect(await catalogComponentsPage.getTitle()).to.eq('gatewayApp.inventoryCatalog.home.title');
    await browser.wait(ec.or(ec.visibilityOf(catalogComponentsPage.entities), ec.visibilityOf(catalogComponentsPage.noResult)), 1000);
  });

  it('should load create Catalog page', async () => {
    await catalogComponentsPage.clickOnCreateButton();
    catalogUpdatePage = new CatalogUpdatePage();
    expect(await catalogUpdatePage.getPageTitle()).to.eq('gatewayApp.inventoryCatalog.home.createOrEditLabel');
    await catalogUpdatePage.cancel();
  });

  it('should create and save Catalogs', async () => {
    const nbButtonsBeforeCreate = await catalogComponentsPage.countDeleteButtons();

    await catalogComponentsPage.clickOnCreateButton();

    await promise.all([
      catalogUpdatePage.setCodeInput('code'),
      catalogUpdatePage.statusSelectLastOption(),
      // catalogUpdatePage.productCodeSelectLastOption(),
    ]);

    expect(await catalogUpdatePage.getCodeInput()).to.eq('code', 'Expected Code value to be equals to code');

    await catalogUpdatePage.save();
    expect(await catalogUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await catalogComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Catalog', async () => {
    const nbButtonsBeforeDelete = await catalogComponentsPage.countDeleteButtons();
    await catalogComponentsPage.clickOnLastDeleteButton();

    catalogDeleteDialog = new CatalogDeleteDialog();
    expect(await catalogDeleteDialog.getDialogTitle()).to.eq('gatewayApp.inventoryCatalog.delete.question');
    await catalogDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(catalogComponentsPage.title), 5000);

    expect(await catalogComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
