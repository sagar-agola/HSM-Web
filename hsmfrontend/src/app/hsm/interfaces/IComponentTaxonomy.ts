export interface IComponentClassTaxonomy{
    id: number,
    componentClass: string
    maintUnitId?:number,
    customerId?: number,
    siteId?: number
 }

 export interface IComponentFamilyTaxonomy{
    id: number,
    familyComponent: string
 }

 export interface IComponentSubClassTaxonomy{
    id: number,
    subClass: string,
    maintItemId?: number,
    customerId?: number,
    siteId?: number
 }

 export interface IComponentBuildSpecTaxonomy{
    id: number,
    buildSpec: string,
    customerId?: number,
    siteId?: number
 }

 export interface IComponentManufacturerTaxonomy{
    id: number,
    componentManufacturer: string,
    customerId?: number,
    siteId?: number
 }