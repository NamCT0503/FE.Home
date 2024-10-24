/* eslint-disable */

import { Helmet } from "react-helmet";
import style from "../css.module/admin/index.module.css";
import { useEffect, useState } from "react";
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
import { API_BASE_URL } from "../router/router";

const url_getSerWeb = 'http://localhost:5000/api/homepage/service/web/getall';
const url_getSerApp = 'http://localhost:5000/api/homepage/service/app/get-all';
const url_info = 'http://localhost:5000/api/homepage/get-account/';

const AdminIndex = () => {
    const [transXIconSearch, setTransXIconSearch] = useState('translateX(0)');
    const [widthInputSearch, setWidthInputSearch] = useState('0px');
    const [transYDropMenu, setTransYDropMenu] = useState('translateY(-120%)');
    const [stateIconSearch, setStateIconSearch] = useState(true);
    const [dataSerWeb, setDataSerWeb] = useState<any>([]);
    const [dataSerApp, setDataSerApp] = useState<any>([]);
    const [infoAcc, setInfoAcc] = useState<any>();

    const navigate = useNavigate();
    const location = useLocation();
    const subAccount = Cookies.get('subAccount');

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
    }, []);

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
                    <div className={style.chatPersional}>
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