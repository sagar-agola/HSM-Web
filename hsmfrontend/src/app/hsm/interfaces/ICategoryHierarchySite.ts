export interface ICategoryHierarchySite{
    id: number,
    parentId?: number,
    categoryCode: string,
    level: number,
    categoryName: string,
    siteId?: number,
    customerId?: number
}