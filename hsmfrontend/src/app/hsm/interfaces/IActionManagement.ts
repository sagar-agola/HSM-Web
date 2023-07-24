export interface IActionManagement{
    id: number,
    requestCode: string,
    requestTypeId: number,
    requestInfo: string,
    dueDate: Date,
    fileName: string,
    assigned: number,
    requested: number,
    dtCreated?: Date,
    actionStatus: number
}