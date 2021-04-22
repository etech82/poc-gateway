import { element, by, ElementFinder } from 'protractor';

export class PackagingComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-packaging div table .btn-danger'));
  title = element.all(by.css('jhi-packaging div h2#page-heading span')).first();
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

export class PackagingUpdatePage {
  pageTitle = element(by.id('jhi-packaging-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  nameInput = element(by.id('field_name'));
  quantityInput = element(by.id('field_quantity'));
  grosWeightInput = element(by.id('field_grosWeight'));
  netWeightInput = element(by.id('field_netWeight'));
  lengthInput = element(by.id('field_length'));
  widthInput = element(by.id('field_width'));
  heightInput = element(by.id('field_height'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setNameInput(name: string): Promise<void> {
    await this.nameInput.sendKeys(name);
  }

  async getNameInput(): Promise<string> {
    return await this.nameInput.getAttribute('value');
  }

  async setQuantityInput(quantity: string): Promise<void> {
    await this.quantityInput.sendKeys(quantity);
  }

  async getQuantityInput(): Promise<string> {
    return await this.quantityInput.getAttribute('value');
  }

  async setGrosWeightInput(grosWeight: string): Promise<void> {
    await this.grosWeightInput.sendKeys(grosWeight);
  }

  async getGrosWeightInput(): Promise<string> {
    return await this.grosWeightInput.getAttribute('value');
  }

  async setNetWeightInput(netWeight: string): Promise<void> {
    await this.netWeightInput.sendKeys(netWeight);
  }

  async getNetWeightInput(): Promise<string> {
    return await this.netWeightInput.getAttribute('value');
  }

  async setLengthInput(length: string): Promise<void> {
    await this.lengthInput.sendKeys(length);
  }

  async getLengthInput(): Promise<string> {
    return await this.lengthInput.getAttribute('value');
  }

  async setWidthInput(width: string): Promise<void> {
    await this.widthInput.sendKeys(width);
  }

  async getWidthInput(): Promise<string> {
    return await this.widthInput.getAttribute('value');
  }

  async setHeightInput(height: string): Promise<void> {
    await this.heightInput.sendKeys(height);
  }

  async getHeightInput(): Promise<string> {
    return await this.heightInput.getAttribute('value');
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

export class PackagingDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-packaging-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-packaging'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
