export interface IRevision {
    id: number,
    changeField: string,
    previousValue: string,
    newValue: string,
    dtCreated: Date,
    changedBy: string,
    dateApproved: Date,
    changeJustification: string
}
