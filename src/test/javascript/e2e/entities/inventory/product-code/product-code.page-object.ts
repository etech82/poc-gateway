import { element, by, ElementFinder } from 'protractor';

export class ProductCodeComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-product-code div table .btn-danger'));
  title = element.all(by.css('jhi-product-code div h2#page-heading span')).first();
  noResult = element(by.id('no-result'));
  entities = element(by.id('entities'));

  async clickOnCreateButton(): Promise<void> {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(): Promise<void> {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons(): Promise<number> {
    return this.deleteButtons.count();
  }

  async getTitle(): Promise<string> {
    return this.title.getAttribute('jhiTranslate');
  }
}

export class ProductCodeUpdatePage {
  pageTitle = element(by.id('jhi-product-code-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  upcInput = element(by.id('field_upc'));
  barcodeInput = element(by.id('field_barcode'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setUpcInput(upc: string): Promise<void> {
    await this.upcInput.sendKeys(upc);
  }

  async getUpcInput(): Promise<string> {
    return await this.upcInput.getAttribute('value');
  }

  async setBarcodeInput(barcode: string): Promise<void> {
    await this.barcodeInput.sendKeys(barcode);
  }

  async getBarcodeInput(): Promise<string> {
    return await this.barcodeInput.getAttribute('value');
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class ProductCodeDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-productCode-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-productCode'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
