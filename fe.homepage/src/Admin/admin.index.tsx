/* eslint-disable */

import { Helmet } from "react-helmet";
import style from "../css.module/admin/index.module.css";
import chatIdx from "../css.module/admin/chat/chat.index.module.css";
import frameChat from "../css.module/admin/chat/chat.frames.module.css";
import React, { useEffect, useState } from "react";
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
import { ws_getAllUserStatus } from "./Chat/service/fe.chat.service";
import { UserStatusEntity } from "../types/app.types";

// const url_getSerWeb = 'http://localhost:5000/api/homepage/service/web/getall';
// const url_getSerApp = 'http://localhost:5000/api/homepage/service/app/get-all';
// const url_info = 'http://localhost:5000/api/homepage/get-account/';
const url_getSerWeb = API_ROUTER.GET_SERWEB;
const url_getSerApp = API_ROUTER.GET_SERAPP;
const url_info = API_ROUTER.GET_ACCOUNT.split(':id/:param')[0];
const url_getMessageInChat1to1 = API_ROUTER.GET_MESSAGEINCHAT11.split(':to')[0];

const AdminIndex = () => {
    const [transXIconSearch, setTransXIconSearch] = useState('translateX(0)');
    const [widthInputSearch, setWidthInputSearch] = useState('0px');
    const [transYDropMenu, setTransYDropMenu] = useState('translateY(-120%)');
    const [transXContainerChat, setTransXContainerChat] = useState('translateX(100%)');
    const [displayContainerChat, setDisplayContainerChat] = useState('none');
    const [stateIconSearch, setStateIconSearch] = useState(true);
    const [dataSerWeb, setDataSerWeb] = useState<any>([]);
    const [dataSerApp, setDataSerApp] = useState<any>([]);
    const [infoAcc, setInfoAcc] = useState<any>();
    const [userStatus, setUserStatus] = useState<any>();
    const [lastMessage, setLastestMessage] = useState<any>([]);
    const [message1to1, setMessage1to1] = useState<any[]>([]);
    const [frameMessage1to1, setFrameMessage1to1] = useState<any[]>([]);
    const [listFrameChatOn, setListFrameChatOn] = useState<number[]>([])

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
        ws_getAllUserStatus(socket, parseInt(subAccount!),setLastestMessage);
        return () => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.close();
            }
        };
    }, []); 

    // useEffect(() => {
    //     setUserStatus(lastMessage?.filter((items: any) => { return items.id!=subAccount}));
    // }, [lastMessage])

    useEffect(() => {
        if (lastMessage) {
            setUserStatus(lastMessage?.filter((items: any) => items.id != subAccount));
        }
    }, [lastMessage, subAccount]);

    useEffect(() => {
        console.log('effff: ', frameMessage1to1)
    }, [frameMessage1to1.length])

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

        if(minutes < 60) return `${minutes} phút trước`
        else if(hours < 24) return `${hours} giờ trước`
        else return `${days} ngày trước`
    }

    const handleClickUserChat = async (user: UserStatusEntity) => {
        // setDisplayContainerChat(display => display==='flex'? 'none': 'flex');
        setTimeout(() => {
            setDisplayContainerChat('none');
        }, 100)
        setTransXContainerChat('translateX(100%)');
        setFrameMessage1to1(preData => [...preData, user]);
        try {
            const url = url_getMessageInChat1to1+`${user.id}`;
            const res = await sendReq(url, {
                method: 'GET'
            });
            const dataRes = await res.json();
            // message1to1.push(dataRes);
            setMessage1to1(preData => [...preData, ...dataRes]);
        } catch (error) {
            console.log('Fetch Error: ', error);
        }
    }

    const handleCloseFrameChat = (id: number) => {
        const currentFrameChat = frameMessage1to1.filter(items => items.id!==id)
        setFrameMessage1to1(currentFrameChat);
        console.log('handle frame: ', frameMessage1to1)
    }

    const handleInputMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight+'px';
    }

    console.log('us: ', userStatus) 
    console.log('lm: ', lastMessage)
    console.log('message 1:1: ', message1to1);
    console.log('frame mess: ', frameMessage1to1);

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
                                            return(
                                                <div 
                                                    className={chatIdx.lineChatLastest}
                                                    style={{
                                                        fontWeight: (item.revicer==subAccount&&item.statusMessage==='sent')?
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

                            </div>
                            <div className={frameChat.areaBottomChat}>
                                <i className="fa-solid fa-microphone"></i>
                                <i className="fa-solid fa-images"></i>
                                <textarea rows={1} id="" onInput={handleInputMessage}></textarea>
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