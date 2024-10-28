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

export interface GroupChatEntity {
    id: string;
    name: string;
    avatar: string;
    leader: number;
    member: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string;
}

export interface ChatEntity {
    id: number;
    grchatid: string;
    sender: number;
    revicer: number;
    message: string;
    status: 'sending' | 'sent' | 'reviced' | 'seen';
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

export interface ViewerEntity {
    id: number;
    idchat: number;
    viewby: number;
    createdAt?: Date | string;
}

export interface UserStatusEntity {
    id: number;
    socket: WebSocket;
    status: 'online' | 'offline';
    lastOnline: Date | null;
}

export interface UserStatusEntity {
    id: number;
    socket: WebSocket;
    fullname: string;
    username: string;
    avatar: string;
    role: string;
    lastMessage: string;
    sentAt: string | Date;
    sender: number;
    revicer: number;
    status: 'online' | 'offline';
    lastOnline: Date | null;
}