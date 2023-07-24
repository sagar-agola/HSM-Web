export interface IFMEA {
    id: number,
    componentHierarchyId: number,
    systemDescription: string,
    componentLevel1Id?: number,
    // componentLevel2Id?: number,
    // componentLevel3Id?: number,
    taskIdentificationNo: string,
    componentTaskFunction: string,
    failureMode: string,
    failureEffect: string,
    failureCause: string,
    endEffect: string,
    taskDescription: string,
    acceptableLimits: string,
    correctiveActions: string,
    taskTypeId: number,
    operationalModeId: number,
    failureRiskTotalScore: number,
    intervalId: number,
    durationId: number,
    resourceQuantity: string,
    tradeTypeId: number,
    parentCode: string,
    origIndic?: number,
    // componentLevel4Id?: number,
    familyTaxonomyId?: number,
    classTaxonomyId?: number,
    subClassTaxonomyId?: number,
    buildSpecTaxonomyId?: number,
    manufacturerTaxonomyId?: number,
    variantId?: number,
    comment: string,
    createdBy: string,
    updatedBy: string,
    dtCreated?: Date,
    dtUpdated?: Date,
    systemStatus: number
}

export interface IFMEAImport {
    componentHierarchyId: string,
    systemDescription: string,
    componentLevel1Id?: string,
    taskIdentificationNo: string,
    componentTaskFunction: string,
    failureMode: string,
    failureEffect: string,
    failureCause: string,
    endEffect: string,
    taskDescription: string,
    acceptableLimits: string,
    correctiveActions: string,
    taskTypeId: string,
    operationalModeId: string,
    failureRiskTotalScore?: number,
    intervalId: string,
    durationId: string,
    resourceQuantity: string,
    tradeTypeId: string,
    parentCode: string,
    origIndic?: number,
    familyTaxonomyId?: string,
    classTaxonomyId?: string,
    subClassTaxonomyId?: string,
    buildSpecTaxonomyId?: string,
    manufacturerTaxonomyId?: string,
    variantId?: number,
    comment: string,
    createdBy: string,
    updatedBy: string,
    dtCreated?: Date,
    dtUpdated?: Date,
    systemStatus?: number
}

export interface IFMEASite {
    id: number,
    componentHierarchyId: number,
    systemDescription: string,
    componentLevel1Id?: number,
    // componentLevel2Id?: number,
    // componentLevel3Id?: number,
    taskIdentificationNo: string,
    componentTaskFunction: string,
    failureMode: string,
    failureEffect: string,
    failureCause: string,
    endEffect: string,
    taskDescription: string,
    acceptableLimits: string,
    correctiveActions: string,
    taskTypeId: number,
    operationalModeId: number,
    failureRiskTotalScore: number,
    intervalId: number,
    durationId: number,
    resourceQuantity: string,
    tradeTypeId: number,
    parentCode: string,
    origIndic?: number,
    // componentLevel4Id?: number,
    familyTaxonomyId?: number,
    classTaxonomyId?: number,
    subClassTaxonomyId?: number,
    buildSpecTaxonomyId?: number,
    manufacturerTaxonomyId?: number,
    variantId?: number,
    categoryId: number,
    fmmtId: number,
    comment: string,
    createdBy: string,
    updatedBy: string,
    dtCreated?: Date,
    dtUpdated?: Date,
    systemStatus: number,
    siteId: number
}

export interface IFMUFTSiteImport {
    componentHierarchyId: string,
    systemDescription: string,
    componentLevel1Id?: string,
    taskIdentificationNo: string,
    componentTaskFunction: string,
    failureMode: string,
    failureEffect: string,
    failureCause: string,
    endEffect: string,
    taskDescription: string,
    acceptableLimits: string,
    correctiveActions: string,
    taskTypeId: string,
    operationalModeId: string,
    failureRiskTotalScore?: number,
    intervalId: string,
    durationId: string,
    resourceQuantity: string,
    tradeTypeId: string,
    parentCode: string,
    origIndic?: number,
    familyTaxonomyId?: string,
    classTaxonomyId?: string,
    subClassTaxonomyId?: string,
    buildSpecTaxonomyId?: string,
    manufacturerTaxonomyId?: string,
    variantId?: number,
    comment: string,
    createdBy: string,
    updatedBy: string,
    dtCreated?: Date,
    dtUpdated?: Date,
    systemStatus?: number,
    site?: number,
    customerId: number
}

export interface IFMEAList {
    id: number,
    taskIdentificationNo: string,
    parentCode: string,
    failureMode:string,
    taskDescription: string,
    failureRiskTotalScore: number,
    acceptableLimits: string,
    correctiveActions: string
}

export interface IAllFMEAList {
    id: number,
    taskIdentificationNo: string,
    parentCode: string,
    systemDescription: string,
    categoryName: string,
    componentTaskFunction: string,
    failureMode:string,
    failureCause: string,
    failureEffect: string,
    endEffect: string,
    taskDescription: string,
    failureRiskTotalScore: number,
    acceptableLimits: string,
    correctiveActions: string,
    taskTypeName: string,
    operationalModeName: string,
    frequencyName: string,
    durationName: string,
    tradeTypeName: string,
    familyTaxonomyId: number,
    familyComponent: string,
    classTaxonomyId: number,
    componentClass: string,
    subClassTaxonomyId: number,
    subClass: string,
    buildSpec: string,
    componentManufacturer: string,
    variantName: string,
    systemStatus: number
}

export interface IAllFMEASiteList {
    id: number,
    taskIdentificationNo: string,
    parentCode: string,
    systemDescription: string,
    categoryName: string,
    componentTaskFunction: string,
    failureMode:string,
    failureCause: string,
    failureEffect: string,
    endEffect: string,
    taskDescription: string,
    failureRiskTotalScore: number,
    acceptableLimits: string,
    correctiveActions: string,
    taskTypeName: string,
    operationalModeName: string,
    frequencyName: string,
    durationName: string,
    tradeTypeName: string,
    familyTaxonomyId: number,
    familyComponent: string,
    classTaxonomyId: number,
    componentClass: string,
    subClassTaxonomyId: number,
    subClass: string,
    buildSpec: string,
    componentManufacturer: string,
    variantName: string,
    systemStatus: number,
    customerId?: number
    siteId?: number
}

export interface IFMEATaskAdded {
    id: number,
    taskId: number,
    fmeaId: number,
    isChecked: boolean,
    isActive: boolean,
    sequenceNo: number
}

export interface IFMEATaskAddedList {
    id: number,
    fmeaId: number,
    taskId: number,
    taskIdentificationNo: string,
    parentCode: string,
    failureMode:string,
    taskDescription: string,
    failureRiskTotalScore: number,
    acceptableLimits: string,
    correctiveActions: string,
    frequencyName: string,
    taskTypeName: string,
    familyTaxonomyId: number,
    familyComponent: string,
    classTaxonomyId: number,
    componentClass: string,
    subClassTaxonomyId: number,
    subClass: string,
    buildSpec: string,
    componentManufacturer: string
}

export interface IFMEATaskAddedSequence {
    id: number,
    fmeaId: number,
    taskId: number,
    sequenceNo: number,
    taskIdentificationNo: string,
    taskDescription: string,
    acceptableLimits: string,
    correctiveActions: string,
    frequencyName: string,
    taskTypeName: string,
}

export interface IComponentTaskFMMT{
    id: number,
    componentTaskName: string
    customerId?: number,
    siteId?: number
}

export interface IFmeaAssembly {
    id: number,
    componentHierarchyId: number,
    systemDescription: string,
    componentLevel1Id?: number,
    // componentLevel2Id?: number,
    // componentLevel3Id?: number,
    taskIdentificationNo: string,
    componentTaskFunction: string,
    failureMode: string,
    failureEffect: string,
    failureCause: string,
    endEffect: string,
    taskDescription: string,
    acceptableLimits: string,
    correctiveActions: string,
    taskTypeId: number,
    operationalModeId: number,
    failureRiskTotalScore: number,
    intervalId: number,
    durationId: number,
    resourceQuantity: string,
    tradeTypeId: number,
    parentCode: string,
    origIndic?: number,
    // componentLevel4Id?: number,
    familyTaxonomyId?: number,
    classTaxonomyId?: number,
    subClassTaxonomyId?: number,
    buildSpecTaxonomyId?: number,
    manufacturerTaxonomyId?: number,
    variantId?: number,
    categoryId: number,
    fmmtId: number,
    comment: string,
    createdBy: string,
    updatedBy: string,
    dtCreated?: Date,
    dtUpdated?: Date,
    systemStatus: number
}

export interface IFMUFTSite {
    id: number,
    componentHierarchyId: number,
    systemDescription: string,
    componentLevel1Id?: number,
    taskIdentificationNo: string,
    componentTaskFunction: string,
    failureMode: string,
    failureEffect: string,
    failureCause: string,
    endEffect: string,
    taskDescription: string,
    acceptableLimits: string,
    correctiveActions: string,
    taskTypeId: number,
    operationalModeId: number,
    failureRiskTotalScore: number,
    intervalId: number,
    durationId: number,
    resourceQuantity: string,
    tradeTypeId: number,
    parentCode: string,
    origIndic?: number,
    familyTaxonomyId?: number,
    classTaxonomyId?: number,
    subClassTaxonomyId?: number,
    buildSpecTaxonomyId?: number,
    manufacturerTaxonomyId?: number,
    variantId?: number,
    comment: string,
    createdBy: string,
    updatedBy: string,
    dtCreated?: Date,
    dtUpdated?: Date,
    systemStatus: number,
    siteId: number,
    customerId: number
}

export interface IFmeaSiteAssembly {
    id: number,
    componentHierarchyId: number,
    systemDescription: string,
    componentLevel1Id?: number,
    taskIdentificationNo: string,
    componentTaskFunction: string,
    failureMode: string,
    failureEffect: string,
    failureCause: string,
    endEffect: string,
    taskDescription: string,
    acceptableLimits: string,
    correctiveActions: string,
    taskTypeId: number,
    operationalModeId: number,
    failureRiskTotalScore: number,
    intervalId: number,
    durationId: number,
    resourceQuantity: string,
    tradeTypeId: number,
    parentCode: string,
    origIndic?: number,
    familyTaxonomyId?: number,
    classTaxonomyId?: number,
    subClassTaxonomyId?: number,
    buildSpecTaxonomyId?: number,
    manufacturerTaxonomyId?: number,
    variantId?: number,
    categoryId: number,
    fmmtId: number,
    comment: string,
    createdBy: string,
    updatedBy: string,
    dtCreated?: Date,
    dtUpdated?: Date,
    systemStatus: number
}