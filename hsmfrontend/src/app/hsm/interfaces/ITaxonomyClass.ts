export interface ITaxonomyClass {
    id: number,
    className: string,
    ahcategoryId: number
}

export interface ITaxonomyClassList {
    id: number,
    className: string,
    categoryName: string
}

export interface IComTaxonomyClass{
    id: number,
    className: string,
    ctaxonomyCategoryId: number
}