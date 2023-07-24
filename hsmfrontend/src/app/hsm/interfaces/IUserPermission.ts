import { IUserPermissionGroup } from "./IUserPermissionGroup";
import { IRoleFeature    } from "./IRoleFeature";

export interface IUserPermission {
    id: number,
    groupId: number,
    roleId: number,
    isActive: boolean,
    userPermissionGroup: IUserPermissionGroup,
    roleFeatures: IRoleFeature
}

export interface IUserPermissionCustomPost {
    roleFeatureIds: number[],
    userId: number,
}