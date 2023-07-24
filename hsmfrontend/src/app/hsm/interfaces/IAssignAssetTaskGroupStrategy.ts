export interface IAssignAssetTaskGroupStrategy{
    id: number,
    taskGroupId: number,
    assetHierarchyId: number,
    componentHierarchyId: number,
    fmeaId: number,
    sequenceId: number
}

export interface ITaskGroupStrategyAdded{
    id: number,
    taskGroupStrategyId: number,
    addedTaskId: number,
    eamItemId: number,
    eamPlanId: number,
    groupId: number,
    isChecked: boolean,
    isActive: boolean,
    sequenceNo: number
}