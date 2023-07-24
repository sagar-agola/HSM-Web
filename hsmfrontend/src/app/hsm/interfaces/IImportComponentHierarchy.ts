export interface IImportComponentHierarchy {
    Id: number,
    HierarchyCode: string,
    CategoryCode: string,
    CategoryName: string,
}

export interface MaintainableImport{
  siteId?: number,
  customerId?: number
  maintainableData: MaintainableData[];
}

export interface MaintainableData{
    maintainableUnitName: string,
    maintainableItems: MaintainableItems[];
}

export interface MaintainableItems {
    maintainableItemName: string,
    subMaintainableItems: string[];
}