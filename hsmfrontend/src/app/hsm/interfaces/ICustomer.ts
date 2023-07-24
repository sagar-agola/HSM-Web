export interface ICustomer {
    id: number,
    customerName: string,
    emailAddress: string,
    location: string,
    contactNumber: string
}


export interface ICloneTaskSite{
    customerId: number,
    siteId: number,
    AssetEntities:IAssetEntities[];
}

export interface IAssetEntities{
    specId: number,
    classId: number,
    manufactureId: number
}
