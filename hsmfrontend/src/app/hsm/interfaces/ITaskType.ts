export interface ITaskType {
    id: number,
    taskTypeName: string,
    createdBy: string,
    dtCreated: Date,
    lastUpdatedBy: string,
    dtLastUpdated: Date,
    customerId?: number,
    siteId?: number
}

export interface IWorkInstructionTaskType{
    id: number,
    taskTypeName: string
}