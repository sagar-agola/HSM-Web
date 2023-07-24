export interface IAssetTaskGroupStrategy {
    id: number,
    taskGroupStrategyId: string,
    taskGroupDescription: string,
    frequencyId: number,
    tradeTypeId: number,
    operationalModeId: number,
    durationId: number,
    taskTypeId: number,
    assetIndustryId: number,
    businessTypeId: number,
    assetTypeId: number,
    processFunctionId: number,
    assetCategoryId: number,
    assetClassTaxonomyId: number,
    assetSpecTaxonomyId: number,
    assetFamilyTaxonomyId: number,
    assetManufacturerTaxonomyId: number,
    componentFamilyTaxonomyId: number,
    componentClassTaxonomyId: number,
    componentSubClassTaxonomyId: number,
    componentBuildSpecTaxonomyId: number,
    componentManufacturerId: number,
    assetHierarchyId: number,
    comment: string,
    createdBy: string,
    updatedBy: string,
    dtCreated: Date,
    dtUpdated: Date,
    systemStatus: number,
    siteId: number,
    customerId: number
}

export interface IAssetTaskGroupStrategyDisplay{
    id: number,
    taskGroupStrategyId: string,
    taskGroupDescription: string,
    frequencyName: string,
    tradeTypeName: string,
    operationalModeName: string,
    taskTypeName: string,
    industryName: string,
    businessType: string,
    assetType: string,
    // assetCategoryName: string,
    processFunction: string,
    className: string,
    specification: string,
    componentFamilies: string,
    assetManufacturer: string,
    familyComponent: string,
    componentClass: string,
    systemStatus: number
}

export interface IAssetTaskGroupStrategyHsmDisplay{
    id: number,
    taskGroupStrategyId: string,
    taskGroupDescription: string,
    frequencyName: string,
    tradeTypeName: string,
    operationalModeName: string,
    taskTypeName: string,
    industryName: string,
    businessType: string,
    assetType: string,
    // assetCategoryName: string,
    processFunction: string,
    className: string,
    specification: string,
    componentFamilies: string,
    assetManufacturer: string,
    familyComponent: string,
    componentClass: string,
    assetHierarchyId: number,
    systemStatus: number
}

export interface IAssignAssetTaskGroupStrategyHierarchy{
    id: number,
    fmeaId: number,
    taskId: number,
    addedTaskId: number,
    assetHierarchyId: number
}

export interface IAddHierarchyToTask {
    id: number,
    fmeaId: number,
    taskId: number,
    taskIdentificationNo: string,
    taskDescription: string,
    acceptableLimits: string,
    correctiveActions: string,
    frequencyName: string,
    taskTypeName: string,
    hierarchyId: number
}

export interface IAddFlocList{
    id: number,
    code: string,
    flocDescription: string
}

export interface IAssignTaskToEquipment{
    id: number,
    taskId: number,
    taskIdentificationNo: string,
    taskDescription: string,
    acceptableLimits: string,
    correctiveActions: string,
    sequenceNo: number
}

export interface IAssignTaskToEquipmentList{
    id: number,
    taskId: number,
    assetHierarchyId: number,
    taskIdentificationNo: string,
    taskDescription: string,
    acceptableLimits: string,
    correctiveActions: string,
    filenames: string,
}

export interface IAssignAssetTaskGroupStrategyMaterial{
    id: number,
    fmeaId: number,
    taskId: number,
    batchId: number,
    componentFamilyId: number,
    componentClassId: number,
    componentSubClassId: number,
    assetHierarchyId: number,
    fileName: string,
    sequenceNo: number,
    isMultiple: boolean,
    isInclude: boolean
}

export interface IAddedFlocTask{
    id: number,
    fmeaId: number,
    taskId: number
}

export interface IAssignAssetTaskGroupStrategyMaterialView {
    convertedMaterial: string
}

export interface ProgressStatus {
    status: ProgressStatusEnum;
    percentage?: number;
  }
    
  export enum ProgressStatusEnum {
    START, COMPLETE, IN_PROGRESS, ERROR
  }

  export interface IAssetTaskGroupStrategyHsm {
    id: number,
    taskGroupStrategyId: string,
    taskGroupDescription: string,
    frequencyId: number,
    tradeTypeId: number,
    operationalModeId: number,
    durationId: number,
    taskTypeId: number,
    assetIndustryId: number,
    businessTypeId: number,
    assetTypeId: number,
    processFunctionId: number,
    assetCategoryId: number,
    assetClassTaxonomyId: number,
    assetSpecTaxonomyId: number,
    assetFamilyTaxonomyId: number,
    assetManufacturerTaxonomyId: number,
    componentFamilyTaxonomyId: number,
    componentClassTaxonomyId: number,
    componentSubClassTaxonomyId: number,
    componentBuildSpecTaxonomyId: number,
    componentManufacturerId: number,
    assetHierarchyId: number,
    comment: string,
    createdBy: string,
    updatedBy: string,
    dtCreated?: Date,
    dtUpdated?: Date,
    systemStatus: number
}

export interface IAssignAssetTaskGroupStrategyMaterialHsm{
    id: number,
    fmeaId: number,
    taskId: number,
    batchId: number,
    categoryName: string,
    assemblyHierarchyId: number,
    maintUnitId: number,
    maintItemId: number,
    maintSubItemId: number,
    fileName: string,
    sequenceNo: number,
    isMultiple: boolean,
    isInclude: boolean,
    comment: string,
    createdBy: string,
    updatedBy: string,
    dtCreated?: Date,
    dtUpdated?: Date,
    systemStatus: number
}

export interface IAssignAssetTaskGroupStrategyMaterialSite{
    id: number,
    fmeaId: number,
    taskId: number,
    batchId: number,
    categoryName: string,
    assemblyHierarchyId: number,
    maintUnitId: number,
    maintItemId: number,
    maintSubItemId: number,
    fileName: string,
    sequenceNo: number,
    isMultiple: boolean,
    isInclude: boolean,
    comment: string,
    createdBy: string,
    updatedBy: string,
    dtCreated?: Date,
    dtUpdated?: Date,
    systemStatus: number,
    siteId?: number,
    customerId?: number
}