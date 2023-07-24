export interface IEAMPlan {
    id: number,
    plannerGroup: string,
    description: string,
    functionalLoc: string,
    description2: string,
    sortField: string,
    mainWorkCtr: string,
    maintActivType: string,
    maintItem: string,
    mainGroup: string,
    groupCounter: number,
    respConstCntr:string,
    profitCenter: string,
    priorityType: string,
    priority: number,
    plantWkCntr: number,
    plant: number,
    planningPlant: number,
    pGrpTaskList: string,
    orderPlanInd: number,
    orderCategory: number,
    objectNumber: string,
    maintPlant: string,
    costCenter: number,
    cOArea: string,
    companyId: number,
    durationId: number,
    aBCindic: number
}


export interface IEAMPLanList{
    id: number,
    functionalLoc: string,
    description2: string,
    maintItem: string,
    maintenancePlan: string,
    maintActivType: string,
    objectNumber: string,
    mainWorkCtr: string,
    plannerGroup: string,
    tradeTypeName: string,
    frequencyName: string,
}

export interface IFLOCEAMPLanList{
    id: number,
    taskId: string,
    code: string,
    flocDesc: string,
    maintItemText: string,
    maintItem: string,
    maintenancePlanName: string,
    objecttype: string,
    mainWorkCtr: string,
    planningPlant: string,
}

export interface IAllEAMPLanList{
    id: number,
    taskPackage: number,
    taskId: string,
    code: string,
    flocDesc: string,
    maintItemText: string,
    maintItem: string,
    maintenancePlanName: string,
    mainWorkCtr: string,
    planningPlant: string,
    maintPlanText: string,
    maintPlanStrategy: string,
    systemStatus: string,
    schedPeriod: string,
    schedIntUnit: string,
    // taskListDescription: string,
    maintenanceStrategy: string,
    plannerGroup: string,
    plant: string,
    workCenter: string,
    attachUrl: number
    // assemblyNo: string,
    // deletionFlag: string,
    // groupCounter: string,
}

export interface IEAMDropdownList{
    id: number,
    functionalLoc: string,
    maintItemText: string,
    planningPlant: string
}

export interface ITaskGroupStrategyPackage{
    id: number,
    taskGroupStrategyId: string,
    taskId: number;
    taskGroupDescription: string,
    taskTypeName: string,
    frequencyName: string,
    tradeTypeName: string,
    operationalModeName: string,
    versions: string,
    activities: number
}

export interface IEAMPlanPackage{
    id: number,
    code: string,
    flocDesc: string,
    maintItemText: string,
    taskId: string,
    maintenancePlanId: number,
    maintItem: string,
    maintenancePlanName: string,
    mainWorkCtr: string,
    plannerGroup: string,
    planningPlant: string
}

export interface IEAMPlanList {
    id: number,
    sequenceNo: number,
    taskIdentificationNo: string,
    taskDescription: string,
    acceptableLimits: string,
    correctiveActions: string,
    frequencyName: string,
    taskTypeName: string,
}

export interface IEAMPlanAttachURL {
    id: number,
    maintItemId: string,
    locationURL: string,
    comment: string
}