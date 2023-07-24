export interface IAssetHierarchy{
    // id: number,
    code: string,
    assetDescription: string,
    maintItemText: string,
    criticality: number,
    taskPackage: number,
    mainWorkCtr: string,
    equipment: string,
    plannerGroup: string,
    planningPlant: string,
    systemCondition: string,
    maintPlanText: string,
    strategy: string,
    systemStatus: string
}

export interface IAssetHierarchyList{
    id: number,
    code: string,
    description: string,
    constType: string,
    mainWorkCtr: string,
    plannerGroup: string,
    planningPlant: string,
    industryName: string,
    businessType: string,
    assetType: string,
    processFunction: string,
    className: string,
    specification: string,
    componentFamilies: string,
    assetManufacturer: string
}


export interface IAssetHierarchyDataTaxonomy{
    id: number,
    code: string,
    description: string,
    categoryId: number,
    categoryName: string,
    classId: number,
    className: string,
    typeId: number,
    typeName: string
}

export interface IAssetHierarchyParam{
    floc: string,
    flocDesc: string,
    pmDesc: string
}