import React from "react";

export const ws_getAllUserStatus = (ws: WebSocket, sub: number, setUseState: React.Dispatch<React.SetStateAction<any>>) => {
    try {
        ws.onmessage = (e) => {
            const data = JSON.parse(e.data);
            if(data.type === 'user-status'){
                // setUseState(data.users?.filter((users: any) => users.id!==sub));
                setUseState(data.users)
            }
        }
    } catch (error) {
        console.log('=== FE - In getAllUserStatus: ', error);
    }
}