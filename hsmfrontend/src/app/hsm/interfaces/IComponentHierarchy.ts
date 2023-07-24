export interface IComponentHierarchy{
    id: number,
    parentId?: number,
    categoryCode: string,
    level: number,
    categoryName: string,
    familyTaxonomyId?: number,
    classTaxonomyId?: number,
    subClassTaxonomyId?: number,
    buildSpecTaxonomyId?: number,
    manufacturerIdTaxonomyId? : number
}

export interface IComponentVariant{
    id: number,
    variantCode: string,
    variantName: string
}