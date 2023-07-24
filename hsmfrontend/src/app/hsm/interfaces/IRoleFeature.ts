export interface IRoleFeature {
    id: number,
    roleNameKey: string,
    categoryId: number,
    isActive: boolean,
}

export interface ICategoryDetail {
    id: number,
    enumKey: string,
    enumValue: string,
    isActive: boolean,
    exclusive: boolean
}

export interface ICustomRoleFeature {
    category: string,
    items: IRoleFeature[];
}