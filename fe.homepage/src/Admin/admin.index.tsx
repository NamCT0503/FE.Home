/* eslint-disable */

import { Helmet } from "react-helmet";
import style from "../css.module/admin/index.module.css";
import chatIdx from "../css.module/admin/chat/chat.index.module.css";
import frameChat from "../css.module/admin/chat/chat.frames.module.css";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Cookies from "js-cookie";
import { sendReq } from "../Sign";
import ServiceOverview from "./Service/service.overview";
import ServicePackage from "./Service/service.package";
import ContentPackage from "./Service/content.package";
import AccountManage from "./Account/account.manage";
import AdminBlogs from "./Blog/admin.blog";
import BlogContent from "./Blog/blog.content";
import API_ROUTER, { API_BASE_URL, WS_BASE_URL } from "../router/router";
// import { ws_getAllUserStatus } from "./Chat/service/fe.chat.service";
import { UserStatusEntity } from "../types/app.types";

// const url_getSerWeb = 'http://localhost:5000/api/homepage/service/web/getall';
// const url_getSerApp = 'http://localhost:5000/api/homepage/service/app/get-all';
// const url_info = 'http://localhost:5000/api/homepage/get-account/';
const url_getSerWeb = API_ROUTER.GET_SERWEB;
const url_getSerApp = API_ROUTER.GET_SERAPP;
const url_info = API_ROUTER.GET_ACCOUNT.split(':id/:param')[0];
const url_getMessageInChat1to1 = API_ROUTER.GET_MESSAGEINCHAT11.split(':to')[0];
const url_changeToSeenMessage = API_ROUTER.SEENMESSAGE_1TO1;

let isReadingFrameChatRef: number|undefined;

const AdminIndex = () => {
    const [transXIconSearch, setTransXIconSearch] = useState('translateX(0)');
    const [widthInputSearch, setWidthInputSearch] = useState('0px');
    const [transYDropMenu, setTransYDropMenu] = useState('translateY(-120%)');
    const [transXContainerChat, setTransXContainerChat] = useState('translateX(100%)');
    const [displayContainerChat, setDisplayContainerChat] = useState('none');
    // const [heightTextarea, setHeightTextArea] = useState('auto');
    const [stateIconSearch, setStateIconSearch] = useState(true);
    const [dataSerWeb, setDataSerWeb] = useState<any>([]);
    const [dataSerApp, setDataSerApp] = useState<any>([]);
    const [infoAcc, setInfoAcc] = useState<any>();
    const [userStatus, setUserStatus] = useState<any>();
    const [lastMessage, setLastestMessage] = useState<any>([]);
    // const [message1to1, setMessage1to1] = useState<any[]>([]);
    const [frameMessage1to1, setFrameMessage1to1] = useState<any[]>([]);
    // const [isReadingFrameChat, setIsReadingFrameChat] = useState<number>();
    const [showAllChatMessage1to1, setShowAllChatMessage1to1] = useState<any[]>([]);
    const [message, setMessage] = useState<any[]>([]);
    const [ws, setWS] = useState<WebSocket>();

    const chatEndRef = useRef<HTMLDivElement | null>(null);

    const navigate = useNavigate();
    const location = useLocation();
    const subAccount = Cookies.get('subAccount');
    const accessToken = Cookies.get('accessToken');

    const fetchData = async (url: string, type: string) => {
        try {
            const res = await fetch(url, {
                method: 'GET'
            });
            const data = await res.json();

            if(type === 'web') setDataSerWeb(data);
            if(type === 'app') setDataSerApp(data);
        } catch (error) {
            console.log('Fetch Error: ', error);
        }
    }

    useEffect(() => {
        const socket = new WebSocket(`${WS_BASE_URL}?token=${accessToken}`);
        setWS(socket);

        const getInfoAcc = async () => {
            try {
                const res = await sendReq(url_info+`${subAccount}/:param`);
                const dataRes = await res.json();
                setInfoAcc(dataRes);
            } catch (error) {
                console.log('Fetch Error: ', error);
            }
        }

        getInfoAcc();
        fetchData(url_getSerWeb, 'web');
        fetchData(url_getSerApp, 'app');
        // ws_getAllUserStatus(socket, parseInt(subAccount!),setLastestMessage); 

        socket.onmessage = async (e) => {
            // console.log('e data: ', e.data);
            const data = JSON.parse(e.data);
            if(data.type === 'user-status'){
                // console.log('ws data: ', data.users);
                setUserStatus(data.users)
            }
            if(data.type === 'last-mess'){
                console.log('data lm: ', data.users)
                setLastestMessage(data.users);
                setUserStatus((prevStatus: any[]) => {
                    return prevStatus?.map(user => {
                        const updatedUser = data.users.find((item: any) => item.id === user.id);
                        return updatedUser ? { ...user, sentAt: updatedUser.sentAt } : user;
                    });
                });
            }
            if(data.type === 'lm-status-response'){
                // console.log('lm status: ', data.users)
                const chatWith = data.users?.filter((users: any) => users.id!=subAccount);
                // console.log('lm status chatWith: ', chatWith)
                await handleGetAllMessage1to1(chatWith[0]?.id);
            }

            if(data.type === 'new-message'){
                console.log('new messs: ', data);
                const chatWith = data.revicer==subAccount? data.sender: data.revicer;
                console.log('chatWith: ', chatWith, isReadingFrameChatRef);
                if(isReadingFrameChatRef===chatWith){
                    // console.log('isReadingFramchat');
                    try {
                        const seenMessage = url_changeToSeenMessage;
                        await sendReq(seenMessage, {
                            method: 'PUT',
                            body: JSON.stringify({ idchat: data.id})
                        });     
                    } catch (error) {
                        console.log('Fetch Error: ', error);
                    }
                } 
                // else {
                    // console.log('isReading else')
                    await handleGetAllMessage1to1(chatWith);
                // }
            }
        }

        return () => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.close();
            }
        };
    },[]); 

    useEffect(() => {
        scrollToBottom();
    }, [frameMessage1to1.length, showAllChatMessage1to1, message, lastMessage]);

    // useEffect(() => {
    //     if(isReadingFrameChat){
    //         handleGetAllMessage1to1(isReadingFrameChat);
    //     }
    // }, [isReadingFrameChat])
// console.log('socket: ', ws);
    useEffect(() => {
        const messageToSend = message.find(mess => mess.message !== "");
        if (messageToSend) {
            // console.log('mess input: ', messageToSend.message);
            if(ws){
                ws.send(JSON.stringify({ type: "message", message: messageToSend.message, revicer: messageToSend.id}));
            }
    
            setMessage(prevMessages =>
                prevMessages.map(mess =>
                    mess.id === messageToSend.id ? { ...mess, message: '' } : mess
                )
            );

            const dom = document.getElementById(`textarea${messageToSend.id}`);
            const textarea = dom as HTMLTextAreaElement;
            if (dom) {
                textarea.value = "";
                dom.style.height = 'auto'
            }
        }
    }, [message]);

    if(!subAccount){
        return(
            <DotLottieReact
                src="https://lottie.host/78b27860-7155-4efe-a4a1-3c4ab8aac22e/9ENLzp9CuO.lottie"
                loop
                autoplay
            />
        )
    }

    const handleClickShowHideSearch = (iconName: string) => {
        if(iconName === 'close' || (iconName === 'search' && stateIconSearch)){
            setTransXIconSearch(trans => trans === 'translateX(600%)'? 'translateX(0)': 'translateX(600%)');
            setWidthInputSearch(width => width === '80%'? '0px': '80%');
            setStateIconSearch(state => state === true? false: true);
        }
        return undefined;
    }

    const handleNavigateMenubar = (to: string) => {
        navigate(to);
    }

    const handleClickAreProfile = () => {
        setTransYDropMenu(trans => (trans==='translateY(-120%)'? 'translateY(0)': 'translateY(-120%)'));
    }

    const handleClickProfile = () => {
        setTransYDropMenu(trans => trans==='translateY(0)'? 'translateY(-120%)': 'translateY(0)')
        navigate(`/admin/accounts/profile/${infoAcc?.username}`, { state: infoAcc});
    }

    const handleClickLogout = () => {
        const confirmLogout = confirm('Bạn chắc chắc muốn đăng xuất chứ?');
        setTransYDropMenu(trans => trans==='translateY(0)'? 'translateY(-120%)': 'translateY(0)');
        if(confirmLogout){
            Object.keys(Cookies.get()).forEach((name: string) => {
                Cookies.remove(name);
            });
            navigate('/auth/signin');
        }
    }

    const handleShowMessage = () => {
        setTimeout(() => {
            // setDisplayContainerChat(display => display==='none'? 'flex': 'none');
            setDisplayContainerChat('flex');
        }, 0)
        setTimeout(() => {
            // setTransXContainerChat(trans => trans==='translateX(100%)'? 'translateX(0)': 'translateX(100%)');
            setTransXContainerChat('translateX(0)');
        }, 100)
    }

    const calculateTimeSentMessage = (time: string) => {
        const timeCurrent = new Date();
        const timeSent = new Date(time);
        const showTime = (timeCurrent as any) - (timeSent as any);

        const minutes = Math.floor(showTime / (1000 * 60));
        const hours = Math.floor(showTime / (1000 * 60 * 60));
        const days = Math.floor(showTime / (1000 * 60 * 60 * 24));
        const month = timeSent.getMonth() + 1;

        if(minutes < 60) return minutes<1? 'bây giờ': `${minutes} phút trước`
        else if(hours < 24) return `${hours} giờ trước`
        else if(days <30) return `${days} ngày trước`
        return `${month}${days}`
    }

    const convertTimeToHMMD = (time: string) => {
        const newTime = new Date(time);
        const hours = newTime.getHours();

        const formatHM = time.split('T')[1].split('.000Z')[0];
        const hoursMinutes = `${hours}${formatHM.slice(2)}`.slice(0, 5);
        const monthDays = time.split('T')[0].slice(5);

        return `${hoursMinutes} ${monthDays}`;
    }

    const handleClickUserChat = async (user: UserStatusEntity) => {
        // setDisplayContainerChat(display => display==='flex'? 'none': 'flex');
        // console.log('user click: ', user);
        setTimeout(() => {
            setDisplayContainerChat('none');
        }, 100)
        setTransXContainerChat('translateX(100%)');
        setFrameMessage1to1(preData => [...preData, user]);
        // setIsReadingFrameChat(user.id);
        isReadingFrameChatRef=user.id;

        const chat = lastMessage?.filter((item: any) => {
            if(
                (item.sender==subAccount || item.revicer==subAccount) &&
                (user.id===item.sender || user.id===item.revicer) &&
                (subAccount==item.sender || subAccount==item.revicer)
            ) return item;
        })
        // console.log('chat clcik: ', chat);

        // const dom = document.querySelector(`#divLineChatLM${chat[0]?.idchat}`);
        const dom = document.getElementById(`divLineChatLM${chat[0]?.idchat}`);
        if(dom) dom.style.fontWeight = 'normal';

        try {
            const seenMessage = url_changeToSeenMessage;
            await sendReq(seenMessage, {
                method: 'PUT',
                body: JSON.stringify({ idchat: chat[0]?.idchat})
            });

            await handleGetAllMessage1to1(user.id);
            // setMessage1to1(preData => [...preData, ...dataRes]);
        } catch (error) {
            console.log('Fetch Error: ', error);
        }
    }

    const handleCloseFrameChat = (id: number) => {
        const currentFrameChat = frameMessage1to1.filter(items => items.id!==id)
        setFrameMessage1to1(currentFrameChat);
        // setIsReadingFrameChat(undefined);
    }

    const handleInputMessage = (e: React.ChangeEvent<HTMLTextAreaElement>, id: number) => {
        // e.target.style.height = 'auto';
        // e.target.style.height = e.target.scrollHeight+'px';
        // setHeightTextArea(e.target.scrollHeight+'px');
        // setIsReadingFrameChat(id);

        const dom = document.getElementById(`textarea${id}`);
        if(dom){
            dom.style.height = e.target.scrollHeight+'px';
            
            // message.map(items => {
            //     if(items.id===id && items.message===''){
            //         dom.style.height = 'auto';
            //     }
            // })
        }
    }

    const handleGetAllMessage1to1 = async (id: number) => {
        try {
            const url = `${url_getMessageInChat1to1}${id}`;
            const res = await sendReq(url, { method: 'GET'});
            const dataRes = await res.json();
            if(dataRes?.status) return alert(`Lỗi lấy tin nhắn với người dùng ${id}.\n Vui lòng thử lại sau!!!`);
            const dataWithFrame = dataRes?.map((items: any) => ({
                ...items,
                idframe: id
            }))

            setShowAllChatMessage1to1((prevData) => {
                const uniqueData = [...prevData];
                dataWithFrame.forEach((newItem: any) => {
                    const index = uniqueData.findIndex((item) => item.id === newItem.id);
                    if (index === -1) {
                        uniqueData.push(newItem);
                    } else {
                        uniqueData[index] = newItem;
                    }
                });
                return uniqueData;
            });
        } catch (error) {
            console.log('Fetch Error: ', error);
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, id: number) => {
        if (e.key === "Enter") {
            e.preventDefault();

            const dom = document.getElementById(`textarea${id}`);
            if(dom){
                const messInput = (dom as HTMLTextAreaElement).value;
                // setMessage(preData => [...preData, {
                //     id: id,
                //     message: messInput
                // }]);

                setMessage(prevMessages => {
                    const existingMessageIndex = prevMessages.findIndex(mess => mess.id === id);
    
                    if (existingMessageIndex !== -1) {
                        const updatedMessages = [...prevMessages];
                        updatedMessages[existingMessageIndex].message = messInput;
                        return updatedMessages;
                    } else {
                        return [...prevMessages, { id: id, message: messInput }];
                    }
                });

                dom.style.height = 'auto';
            } else {
                console.log('k thấy dom!')
            }
        }
    };

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleClickTextArea = async (frame: any) => {
        isReadingFrameChatRef=frame.id;
        try {
            const seenMessage = url_changeToSeenMessage;
            await sendReq(seenMessage, {
                method: 'PUT',
                body: JSON.stringify({ idchat: frame.idchat})
            });

            if(showAllChatMessage1to1.at(-1)?.status!=='seen'){
                const chatWith = frame.sender==subAccount? frame.revicer: frame.sender;
                await handleGetAllMessage1to1(chatWith);
            }
        } catch (error) {
            console.log('Fetch Error: ', error);
        }
    }

    let idchatUnique: number[] = [];
    const dom = document.querySelectorAll('[class*="wrapContainerContent"], [class*="wrapContainerMenubar"], [class*="wrapNavbarHeader"]');
    if(dom){
        dom.forEach((element) => {
            element.addEventListener('click', () => {
                // setIsReadingFrameChat(undefined);
                isReadingFrameChatRef=undefined;
            });
        });
    }

    // console.log('us: ', userStatus) 
    // console.log('lm: ', lastMessage)
    // // console.log('message 1:1: ', message1to1);
    console.log('frame mess: ', frameMessage1to1);
    console.log('all messs 1:1: ', showAllChatMessage1to1);
    console.log('frame current: ', isReadingFrameChatRef);

    return(
        <>
        <Helmet>
            <style>{`
                body, html {
                    overflow: hidden; 
                }
            `}</style>
        </Helmet>
        <div className={style.wrapContainerIndexPage}>
            <div 
                className={chatIdx.wrapContainerChatIdx}
                style={{
                    transform: transXContainerChat,
                    display: displayContainerChat
                }}
            >
                <div className={chatIdx.containerSearchUser}>
                    <input type="text" placeholder="Tìm kiếm người dùng" />
                    <i className="fa-solid fa-magnifying-glass"></i>
                </div>
                <div className={chatIdx.containerUser}>
                    {(userStatus?.length!==0)? 
                    userStatus?.map((items: any) => {
                        return(
                            <div className={chatIdx.infoUserChat} 
                                onClick={() => handleClickUserChat(items)}
                            >
                                <div className={chatIdx.areaAvatarChat}>
                                    <img src={`${API_BASE_URL}/${items.avatar}`} alt="" />
                                    <div className={items.status==='online'? chatIdx.isOnline: ''}></div>
                                </div>
                                <div className={chatIdx.areaLineChatLastest}>
                                    <div className={chatIdx.fullnameUserChat}>
                                        {items.fullname}
                                    </div>
                                    <span>
                                        {calculateTimeSentMessage(items.sentAt)? calculateTimeSentMessage(items.sentAt): ''}
                                    </span>
                                    {lastMessage?.map((item: any) => {
                                        if(
                                            (item.sender==subAccount || item.revicer==subAccount) &&
                                            (items.id===item.sender || items.id===item.revicer) &&
                                            (subAccount==item.sender || subAccount==item.revicer)
                                        ){
                                            if(!idchatUnique.includes(item.idchat)){
                                                idchatUnique.push(item.idchat);
                                                return(
                                                    <div 
                                                        id={`divLineChatLM${item.idchat}`}
                                                        className={chatIdx.lineChatLastest}
                                                        style={{
                                                            fontWeight: (item.revicer==subAccount&&item.statusMessage!=='seen')?
                                                            600: 0
                                                        }}
                                                    >
                                                        {
                                                            item.sender==subAccount?
                                                            `Bạn: ${item.lastMessage}`:
                                                            item.lastMessage?
                                                            `${item.lastMessage}`:
                                                            'Chưa có tin nhắn nào.'
                                                        }
                                                    </div>
                                                )
                                            }
                                        }
                                    })}
                                </div>
                                <div className={chatIdx.optionUserChat}>
                                    <i className="fa-solid fa-ellipsis"></i>
                                </div>
                            </div>
                        )
                    })
                    :
                    <span>Không có người dùng nào khác.</span>}
                </div>
            </div>
            <div className={frameChat.wrapContainerFrameChat}>
                {frameMessage1to1.map(frame => {
                    return(
                        <div className={frameChat.containerFrameChat}>
                            <div className={frameChat.areaTopFramChat}>
                                <div className={`${frameChat.operationChat} ${frameChat.infoAccTop}`}>
                                    <div className={frameChat.areaInfoUser}>
                                        <img src={`${API_BASE_URL}/${frame.avatar}`} alt="" />
                                        <div>
                                            <div className={frameChat.divFullname}>{frame.fullname}</div>
                                            <div>
                                                {
                                                    frame.lastOnline?
                                                    `Hoạt động ${calculateTimeSentMessage(frame.lastOnline)}`: 
                                                    <>
                                                        Đang hoạt động <i id={frameChat.online} className="fa-solid fa-circle"></i>
                                                    </>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className={frameChat.areaOptionFrameChat}>
                                        <i className="fa-solid fa-phone"></i>
                                        <i className="fa-solid fa-video"></i>
                                        <i id={frameChat.minimize} className="fa-solid fa-window-minimize"></i>
                                        <i className="fa-solid fa-xmark" onClick={() => handleCloseFrameChat(frame.id)}></i>
                                    </div>
                                </div>
                                <div className={frameChat.operationChat}>

                                </div>
                            </div>
                            <div className={frameChat.areaViewChat}>
                                {
                                    showAllChatMessage1to1.length!==0?
                                    showAllChatMessage1to1.map(items => {
                                        let showStatus: any = 'Đang gửi'
                                        if(frame.id===items.idframe){
                                            if(items.status==='sent') showStatus = `Đã gửi lúc ${convertTimeToHMMD(items.updatedAt)}`
                                            if(items.status==='reviced') showStatus = `Đã nhận lúc ${convertTimeToHMMD(items.updatedAt)}`
                                            if(items.status==='seen') showStatus = `Đã xem lúc ${convertTimeToHMMD(items.updatedAt)}`

                                            return(
                                                <>
                                                <div key={items.id} className={`${frameChat.divMessage} ${items.sender==subAccount? frameChat.sendByMe: ''}`}>
                                                    <div className={frameChat.message}>{items.message}</div>
                                                    <div className={frameChat.deltailChat}>
                                                        {showStatus}
                                                    </div>
                                                </div>
                                                </>
                                            )
                                        }
                                    }):
                                    <>
                                    <div>Hãy bắt đầu những tin nhắn đầu tiên nhé!</div>
                                    </>
                                }
                                <div ref={chatEndRef} />
                            </div>
                            <div className={frameChat.areaBottomChat}>
                                <i className="fa-solid fa-microphone"></i>
                                <i className="fa-solid fa-images"></i>
                                <textarea 
                                    id={`textarea${frame.id}`}
                                    rows={1} 
                                    onInput={(e: ChangeEvent<HTMLTextAreaElement>) => handleInputMessage(e, frame.id)} 
                                    // value={message}
                                    // value={message.find(mess => mess.id===frame.id)?.message}
                                    // onChange={(e) => setMessage((preData: any) => [...preData, {
                                    //     id: frame.id,
                                    //     message: e.target.value
                                    // }])}
                                    onKeyDown={(e) => handleKeyDown(e, frame.id)}
                                    // onClick={() => {
                                    //     // setIsReadingFrameChat(frame.id);
                                    //     isReadingFrameChatRef=frame.id
                                    // }}
                                    onClick={() => handleClickTextArea(frame)}
                                    // style={{
                                    //     height: heightTextarea
                                    // }}
                                >
                                </textarea>
                                <i className="fa-solid fa-face-smile-beam"></i>
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className={style.wrapContainerMenubar}>
                <img src="/favicon.ico" alt="" onClick={() => handleNavigateMenubar('/admin/index')} />
                <div className={style.containerMenubar}>
                    <h4>Danh mục quản lý</h4>
                    <div 
                        className={
                        `${style.itemMenubar} ${location.pathname.includes('index')? style.currentPage: ''}`
                        }
                        onClick={() => handleNavigateMenubar('index')}
                    >
                        <i className="fa-solid fa-house"></i>
                        <span>Tổng quan</span>
                    </div>
                    <div 
                        className={
                            `${style.itemMenubar} ${location.pathname.includes('/admin/service')? style.currentPage: ''}`
                        }
                        onClick={() => handleNavigateMenubar('service')}
                    >
                        <i className="fa-solid fa-briefcase"></i>
                        <span>Dịch vụ</span>
                    </div>
                    <div 
                        className={
                            `${style.itemMenubar} ${location.pathname.includes('blogs')? style.currentPage: ''}`
                        }
                        onClick={() => handleNavigateMenubar('blogs')}
                    >
                        <i className="fa-solid fa-blog"></i>
                        <span>Bài đăng</span>
                        <div className={style.notifyBlogs}>
                            9+
                        </div>
                    </div>
                    <div 
                        className={
                            `${style.itemMenubar} ${location.pathname.includes('/admin/accounts')? style.currentPage: ''}`
                        }
                        onClick={() => handleNavigateMenubar('accounts')}
                    >
                        <i className="fa-solid fa-user-tie"></i>
                        <span>Tài khoản</span>
                    </div>
                </div>
            </div>
            <div className={style.wrapNavbarHeader}>
                <div className={style.containerSearchArea}>
                    <i 
                        id={style.iconSearch} 
                        className="fa-solid fa-magnifying-glass"
                        style={{
                            transform: transXIconSearch
                        }}
                        onClick={() => (handleClickShowHideSearch('search')? handleClickShowHideSearch('search'): console.log(1))}
                    ></i>
                    <i 
                        id={style.iconCloseSearch} 
                        className="fa-solid fa-xmark"
                        onClick={() => handleClickShowHideSearch('close')}
                    ></i>
                    <input 
                        type="text" 
                        placeholder="Nhập để tìm kiếm"
                        style={{
                            width: widthInputSearch
                        }}
                    />
                </div>
                <div className={style.containerProfileArea}>
                    <div className={style.notifyPersional}>
                        <i className="fa-regular fa-bell"></i>
                        <span>5</span>
                    </div>
                    <div className={style.chatPersional} onClick={handleShowMessage}>
                        <i className="fa-regular fa-comments"></i>
                        <span>3</span>
                    </div>
                    <div 
                        className={style.areaProfile}
                        onClick={handleClickAreProfile}
                    >
                        <img 
                            src={
                                infoAcc?.avatar?
                                `${API_BASE_URL}/${infoAcc?.avatar}`:
                                `${API_BASE_URL}/default_image.jpg`
                            } 
                            alt="" 
                        />
                        <span>{infoAcc?.fullname}</span>
                        <i className="fa-solid fa-chevron-down"></i>
                    </div>
                </div>
                <div 
                    className={style.areaDropMenuProfile}
                    style={{
                        transform: transYDropMenu
                    }}
                >
                    <div 
                        className={style.divOption}
                        onClick={handleClickProfile}
                    >
                        <i className="fa-solid fa-user"></i>
                        <span>Thông tin tài khoản</span>
                    </div>
                    <div 
                        className={style.divOption}
                        onClick={handleClickLogout}
                    >
                        <i className="fa-solid fa-right-from-bracket"></i>
                        <span>Đăng xuất</span>
                    </div>
                </div>
            </div>
            <div className={style.wrapContainerContent}>
                <Routes>
                    <Route path="service" element={<ServiceOverview></ServiceOverview>}></Route>
                    <Route path="service/website" element={<ServicePackage data={dataSerWeb}></ServicePackage>}></Route>
                    <Route path="service/website/*" element={<ContentPackage></ContentPackage>}></Route>
                    <Route path="service/mobile" element={<ServicePackage data={dataSerApp}></ServicePackage>}></Route>
                    <Route path="service/mobile/*" element={<ContentPackage></ContentPackage>}></Route>
                    <Route path="blogs" element={<AdminBlogs></AdminBlogs>}></Route>
                    <Route path="blogs/content/*" element={<BlogContent></BlogContent>}></Route>
                    <Route path="accounts/*" element={<AccountManage></AccountManage>}></Route>
                </Routes>
            </div>
        </div>
        </>
    )
}

export default AdminIndex;