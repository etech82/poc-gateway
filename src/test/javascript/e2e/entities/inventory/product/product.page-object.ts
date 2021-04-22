import { element, by, ElementFinder } from 'protractor';

export class ProductComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-product div table .btn-danger'));
  title = element.all(by.css('jhi-product div h2#page-heading span')).first();
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

export class ProductUpdatePage {
  pageTitle = element(by.id('jhi-product-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  nameInput = element(by.id('field_name'));
  descriptionInput = element(by.id('field_description'));
  companyInput = element(by.id('field_company'));
  typeSelect = element(by.id('field_type'));
  storageTypeSelect = element(by.id('field_storageType'));
  priceInput = element(by.id('field_price'));
  salesUnitSelect = element(by.id('field_salesUnit'));
  salesQuantityInput = element(by.id('field_salesQuantity'));
  imageInput = element(by.id('file_image'));
  statusSelect = element(by.id('field_status'));

  productCodeSelect = element(by.id('field_productCode'));
  categorySelect = element(by.id('field_category'));
  packagingSelect = element(by.id('field_packaging'));

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

  async setDescriptionInput(description: string): Promise<void> {
    await this.descriptionInput.sendKeys(description);
  }

  async getDescriptionInput(): Promise<string> {
    return await this.descriptionInput.getAttribute('value');
  }

  async setCompanyInput(company: string): Promise<void> {
    await this.companyInput.sendKeys(company);
  }

  async getCompanyInput(): Promise<string> {
    return await this.companyInput.getAttribute('value');
  }

  async setTypeSelect(type: string): Promise<void> {
    await this.typeSelect.sendKeys(type);
  }

  async getTypeSelect(): Promise<string> {
    return await this.typeSelect.element(by.css('option:checked')).getText();
  }

  async typeSelectLastOption(): Promise<void> {
    await this.typeSelect.all(by.tagName('option')).last().click();
  }

  async setStorageTypeSelect(storageType: string): Promise<void> {
    await this.storageTypeSelect.sendKeys(storageType);
  }

  async getStorageTypeSelect(): Promise<string> {
    return await this.storageTypeSelect.element(by.css('option:checked')).getText();
  }

  async storageTypeSelectLastOption(): Promise<void> {
    await this.storageTypeSelect.all(by.tagName('option')).last().click();
  }

  async setPriceInput(price: string): Promise<void> {
    await this.priceInput.sendKeys(price);
  }

  async getPriceInput(): Promise<string> {
    return await this.priceInput.getAttribute('value');
  }

  async setSalesUnitSelect(salesUnit: string): Promise<void> {
    await this.salesUnitSelect.sendKeys(salesUnit);
  }

  async getSalesUnitSelect(): Promise<string> {
    return await this.salesUnitSelect.element(by.css('option:checked')).getText();
  }

  async salesUnitSelectLastOption(): Promise<void> {
    await this.salesUnitSelect.all(by.tagName('option')).last().click();
  }

  async setSalesQuantityInput(salesQuantity: string): Promise<void> {
    await this.salesQuantityInput.sendKeys(salesQuantity);
  }

  async getSalesQuantityInput(): Promise<string> {
    return await this.salesQuantityInput.getAttribute('value');
  }

  async setImageInput(image: string): Promise<void> {
    await this.imageInput.sendKeys(image);
  }

  async getImageInput(): Promise<string> {
    return await this.imageInput.getAttribute('value');
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

  async productCodeSelectLastOption(): Promise<void> {
    await this.productCodeSelect.all(by.tagName('option')).last().click();
  }

  async productCodeSelectOption(option: string): Promise<void> {
    await this.productCodeSelect.sendKeys(option);
  }

  getProductCodeSelect(): ElementFinder {
    return this.productCodeSelect;
  }

  async getProductCodeSelectedOption(): Promise<string> {
    return await this.productCodeSelect.element(by.css('option:checked')).getText();
  }

  async categorySelectLastOption(): Promise<void> {
    await this.categorySelect.all(by.tagName('option')).last().click();
  }

  async categorySelectOption(option: string): Promise<void> {
    await this.categorySelect.sendKeys(option);
  }

  getCategorySelect(): ElementFinder {
    return this.categorySelect;
  }

  async getCategorySelectedOption(): Promise<string> {
    return await this.categorySelect.element(by.css('option:checked')).getText();
  }

  async packagingSelectLastOption(): Promise<void> {
    await this.packagingSelect.all(by.tagName('option')).last().click();
  }

  async packagingSelectOption(option: string): Promise<void> {
    await this.packagingSelect.sendKeys(option);
  }

  getPackagingSelect(): ElementFinder {
    return this.packagingSelect;
  }

  async getPackagingSelectedOption(): Promise<string> {
    return await this.packagingSelect.element(by.css('option:checked')).getText();
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

export class ProductDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-product-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-product'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
