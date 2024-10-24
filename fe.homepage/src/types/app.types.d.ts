export interface ServiceMobileEntity {
    id: number;
    type: string;
    title: string;
    subtitle: string;
    createdAt: Date | string;
    updatedAt: Date | string;
    deletedAt: Date | string;
}

export interface ServiceWebEntity {
    id: number;
    title: string;
    price: string;
    createdAt: Date | string;
    updatedAt: Date | string;
    deletedAt: Date | string;
}

export interface ContentMobileEntity{
    id: number;
    serapp_id: number;
    icon: string;
    content: string;
    createdAt: Date | string;
    updatedAt: Date | string;
    deletedAt: Date | string;
}

export interface ContentWebEntity{
    id: number;
    serweb_id: number;
    content: string;
    createdAt: Date | string;
    updatedAt: Date | string;
    deletedAt: Date | string;
}

export interface BlogsEntity {
    id: number;
    img: string;
    title: string;
    description: string;
    postedAt: Date | string;
    postedBy: number;
    tag: string;
    isOutstanding: boolean;
    view: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string;
}

export interface BlogContentEntity {
    id: number;
    blogid: number;
    type_content: string;
    content: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string;
}

export interface AccountEntity {
    id: number;
    fullname: string;
    username: string;
    password: string;
    avatar: string;
    email: string;
    role: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string;
}