export interface ITaxonomyType {
    id: number,
    typeName: string,
    ahclassId: number,
    ahcategoryId: number
}

export interface ITaxonomyTypeList {
    id: number,
    typeName: string,
    className: string,
    categoryName: string
}

export interface IComTaxonomyType{
    id: number,
    typeName: string,
    ctaxonomyClassId: number,
    ctaxonomyCategoryId: number
}