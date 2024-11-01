// import React from "react";

// export const ws_getAllUserStatus = (ws: WebSocket, sub: number, setUseState: React.Dispatch<React.SetStateAction<any>>) => {
//     try {
//         ws.onmessage = (e) => {
//             const data = JSON.parse(e.data);
//             // console.log('sub acc: ', sub)
//             console.log('ws data: ', data.users? data.users: data);
//             if(data.type === 'user-status'){
//                 // setUseState(data.users?.filter((users: any) => users.id!==sub));
//                 // setUseState(data.users)
//                 setUseState((prevUsers: any) => {
//                     if (JSON.stringify(prevUsers) !== JSON.stringify(data.users)) {
//                         return [...data.users];
//                     }
//                     return prevUsers;
//                 });
//             }
//         }
//     } catch (error) {
//         console.log('=== FE - In getAllUserStatus: ', error);
//     }
// }