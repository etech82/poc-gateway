import { element, by, ElementFinder } from 'protractor';

export class OrderItemComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-order-item div table .btn-danger'));
  title = element.all(by.css('jhi-order-item div h2#page-heading span')).first();
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

export class OrderItemUpdatePage {
  pageTitle = element(by.id('jhi-order-item-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  quantityInput = element(by.id('field_quantity'));
  totalPriceInput = element(by.id('field_totalPrice'));
  statusSelect = element(by.id('field_status'));

  locationOrderSelect = element(by.id('field_locationOrder'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setQuantityInput(quantity: string): Promise<void> {
    await this.quantityInput.sendKeys(quantity);
  }

  async getQuantityInput(): Promise<string> {
    return await this.quantityInput.getAttribute('value');
  }

  async setTotalPriceInput(totalPrice: string): Promise<void> {
    await this.totalPriceInput.sendKeys(totalPrice);
  }

  async getTotalPriceInput(): Promise<string> {
    return await this.totalPriceInput.getAttribute('value');
  }

  async setStatusSelect(status: string): Promise<void> {
    await this.statusSelect.sendKeys(status);
  }

  async getStatusSelect(): Promise<string> {
    return await this.statusSelect.element(by.css('option:checked')).getText();
  }

  async statusSelectLastOption(): Promise<void> {
    await this.statusSelect.all(by.tagName('option')).last().click();
  }

  async locationOrderSelectLastOption(): Promise<void> {
    await this.locationOrderSelect.all(by.tagName('option')).last().click();
  }

  async locationOrderSelectOption(option: string): Promise<void> {
    await this.locationOrderSelect.sendKeys(option);
  }

  getLocationOrderSelect(): ElementFinder {
    return this.locationOrderSelect;
  }

  async getLocationOrderSelectedOption(): Promise<string> {
    return await this.locationOrderSelect.element(by.css('option:checked')).getText();
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

export class OrderItemDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-orderItem-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-orderItem'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
