/* eslint-disable */

import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import style from "../../css.module/admin/account.manage.module.css";
import serOverview from '../../css.module/admin/service.web.module.css';
import { useNavigate } from "react-router-dom";
import { sendReq } from "../../Sign";
import API_ROUTER from "../../router/router";
import AccountListView from "./account.lisview";

// const url_getAccount = 'http://localhost:5000/api/homepage/get-account/'
const url_getAccount = API_ROUTER.GET_ACCOUNT.split(':id/:param')[0];

const AccountManage = () => {
    const [dataAccount, setDataAccount] = useState<any>([])

    const navigate = useNavigate();

    const roleAccount = Cookies.get('roleAccount');
    const subAccount = Cookies.get('subAccount');
    if(!roleAccount) return(<div>Không thể truy cập!</div>)

    useEffect(() => {
        fetchData(url_getAccount);
    }, [])

    const fetchData = async (url: string) => {
        try {
            let res: any;
            if(roleAccount === 'admin'){
                res = await sendReq(url+`${subAccount}/:param`, {
                    method: 'GET'
                })
            } else {
                res = await sendReq(url+':id/:param', {
                    method: 'GET'
                });
            }
            const dataRes = await res.json();
            setDataAccount(dataRes);
        } catch (error) {
            console.log('Fetch Error: ',error);
        }
    }

    const handleClickBtnCreate = (to: string) => {
        navigate(to);
    }

    return(
        <div className={style.wrapContainerLayoutMain}>
            <div className={serOverview.wrapContainerTitlePage}>
                <div className={serOverview.leftContentTitlePage}>
                    <div className={serOverview.iconTitlePage}>
                        <i className="fa-solid fa-user-tie"></i>
                    </div>
                    <div className={serOverview.contentTitlePage}>
                        <span className={serOverview.titlePage}>Tài khoản</span>
                        <span>Trang quản lý tài khoản</span>
                    </div>
                </div>
                <div className={serOverview.rightContentTitlePage}>
                    <i className="fa-solid fa-user-tie"></i>
                    <span>Tài khoản</span>
                </div>
            </div>
            <div 
                className={style.createBlog}
                style={{
                    display: dataAccount?.length? 'block': 'none'
                }}
            >
                <button className={style.btnCreate} onClick={() => handleClickBtnCreate('/auth/signup')}>
                    <i className="fa-solid fa-plus"></i>
                </button>
            </div>
            <div>
                <AccountListView data={dataAccount}></AccountListView>
            </div>
        </div>
    )
}

export default AccountManage;