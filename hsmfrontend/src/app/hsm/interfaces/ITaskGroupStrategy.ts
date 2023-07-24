export interface ITaskGroupStrategy{
    id: number,
    stategyPackageId: number,
    taskStrategyId: number,
    isChecked: boolean,
    isActive: boolean
}

export interface ITaskGroupStrategyPackageAdded{
    id: number,
    tGSPackageId: number,
    eamItemId: number,
    eamPlanId: number,
    isChecked: boolean,
    isActive: boolean
}

export interface ITaskGroupStrategyPackageSequenceAdded{
    id: number,
    taskId: number,
    tGSPackageId: number,
    sequenceNo: number
}

export interface ITaskGroupStrategyPackageFinalSequence{
    id: number,
    taskId: number,
    tgsPackageId: number,
    sequenceNo: number
}

export interface ITaskGroupStrategyGroupId{
    taskId: number
}

export interface ITaskGroupStrategySequence{
    id: number,
    taskId: number,
    tgsPackageId: number,
    sequenceNo: number,
    taskIdentificationNo: string,
    taskDescription: string,
    acceptableLimits: string,
    correctiveActions: string,
    frequencyName: string,
    taskTypeName: string
}