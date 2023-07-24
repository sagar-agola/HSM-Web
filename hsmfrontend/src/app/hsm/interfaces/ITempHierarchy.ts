export interface ITempHierarchy {
    id: number,
    parentId: number,
    code: string,
    level: number,
    description: string,
    constType: string,
    mainWorkCtr: string,
    plannerGroup: string,
    planningPlant: string,
    maintenancePlant: string,
    costCenter: string,
    sortField: string,
    supFuncLoc: string,
    objectType: string,
    systemStatus: string,
    createdOn: string,
    abcindicator: string,
    abcindicatorOrig: string,
    industryId: number,
    businessTypeId: number,
    assetTypeId: number,
    processFunctionId: number,
    classId: number,
    specId: number,
    familyId: number,
    manufacturerId: number
}

export interface ITaxonomyIdList {
    id: number
}