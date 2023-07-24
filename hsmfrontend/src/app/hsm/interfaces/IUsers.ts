export interface IUsers {
    id: number,
    userName: string,
    password: string,
    emailAddress: string,
    isAdmin: boolean,
    firstName: string,
    lastName: string,
    phoneNo: string,
    isActive: boolean,
    groupId?: number,
    customerId?: number,
    siteId?: number,
    photo: string
    group: string,
    customer: string,
    site: string
}

export interface IUserData {
    username: string,
    password: string,
    type: string
}

export interface IUserDataInfo{
    users: IUsers,
    userType: string,
    redirectUrl: string,
    token: string,
    isTopLevelAdmin: boolean
}

export interface IUserModel {
    id: number,
    userName: string,
    password: string,
    emailAddress: string,
    isAdmin: boolean,
    firstName: string,
    lastName: string,
    phoneNo: string,
    siteName: string,
    userStatus: string,
    groupName: string,
}