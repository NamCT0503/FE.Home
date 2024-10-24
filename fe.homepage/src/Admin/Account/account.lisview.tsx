/* eslint-disable */

import style from "../../css.module/admin/service.package.module.css";
import accMana from "../../css.module/admin/account.manage.module.css";
import React, { useRef, useState } from "react";
import Cookies from "js-cookie";
import { useLocation } from "react-router-dom";
import { AccountEntity } from "../../types/app.types";
import { sendReq } from "../../Sign";
import API_ROUTER, { API_BASE_URL } from "../../router/router";

interface AccList {
    data: AccountEntity[]
}

// const url = 'http://localhost:5000/api/homepage/account/delete-account';
// const url_update = 'http://localhost:5000/api/homepage/account/update-account';
// const url_changpwd = 'http://localhost:5000/api/homepage/account/change-password';
const url = API_ROUTER.DELETE_ACCOUNT;
const url_update = API_ROUTER.UPDATE_ACCOUNT;
const url_changpwd = API_ROUTER.CHANGEPWD;
const accessToken = Cookies.get('accessToken');

const AccountListView = (props: AccList) => {
    const {data} = props;
    const location = useLocation();
    const dataState = location.state;

    const [dataChange, setDataChange] = useState({
        fullname: '',
        username: '',
        avatar: null as any,
        email: '',
        role: ''
    });
    const [password, setPassword] = useState({
        oldpass: '',
        newpass: ''
    });
    const [showChangePwd, setShowChangePwd] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDelete = async (id: number) => {
        try {
            const confirmDel = confirm('Hành động không thể hoàn tác!\nBạn vẫn muốn thực hiện?');
            if(confirmDel){
                const res = await sendReq(url, {
                    method: 'DELETE',
                    body: JSON.stringify({ id: id})
                });
    
                const dataRes = await res.json();
                return alert(dataRes.message);
            }
        } catch (error) {
            console.log('Delete Error: ', error);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDataChange({
            ...dataChange,
            [e.target.name]: e.target.value
        })

        setPassword({
            ...password,
            [e.target.name]: e.target.value
        })
    }

    const handleClickSave = async () => {
        const formData = new FormData();

        dataChange.fullname?
        formData.append('fullname', dataChange.fullname):
        null;
        dataChange.username?
        formData.append('username', dataChange.username):
        null;
        dataChange.avatar?
        formData.append('avatar', dataChange.avatar):
        null;
        dataChange.email?
        formData.append('email', dataChange.email):
        null;

        try {
            const res = await fetch(url_update, {
                method: "PUT",
                body: formData,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            const dataRes = await res.json();
            alert(dataRes.message);
        } catch (error) {
            console.log('Update Error: ', error);
        }
    }

    const handleClickCancel = () => {
        setDataChange({
            fullname: (data as any).fullname,
            username: (data as any).username,
            avatar: null,
            email: (data as any).email? (data as any)?.email: "Không có",
            role: (data as any).role
        })
    }

    const handleClickSpanChangePwd = () => {
        setShowChangePwd((show => show? false: true));
    }

    const handleChangePwd = async () => {
        try {
            const res = await sendReq(url_changpwd, {
                method: "PUT",
                body: JSON.stringify(password)
            });
            const dataRes = await res.json();
            return alert(dataRes.message);
        } catch (error) {
            console.log('Change Password Error: ', error);
        }
    }

    const handleClickDivImg = () => {
        fileInputRef.current?.click();
    };

    return(
        <div className={`${style.wrapTable} ${accMana.wrapTable}`}>
            {
                ((data as any)?.map && !location.pathname.includes('profile'))?
                <table>
                    <tr className={accMana.headTable}>
                        <th>ID</th>
                        <th>Họ tên</th>
                        <th>Username</th>
                        <th>Avatar</th>
                        <th>Email</th>
                        <th>Chức vụ</th>
                        <th>Tùy chọn</th>
                    </tr>
                    <tbody>
                        {data.map((items => {
                            return(
                                <tr className={accMana.trContent}>
                                    <td className={accMana.tdID}>{items.id}</td>
                                    <td>{items.fullname}</td>
                                    <td>{items.username}</td>
                                    <td className={accMana.tdAvatar}>{items.avatar? <img src={`${API_BASE_URL}/${items.avatar}`}/>: "Không có"}</td>
                                    <td>{items.email? items.email: "Không có"}</td>
                                    <td>{items.role}</td>
                                    <td 
                                        className={style.areaButton}
                                        style={{
                                            transform: 'translateY(105%)'
                                        }}
                                    >
                                        <button 
                                            className={style.btnDelete}
                                            onClick={() => handleDelete(items.id)}
                                        >
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            )
                        }))}
                    </tbody>
                </table>:
                <div className={accMana.wrapContainerInfoAccount}>
                    <h3>Thông tin tài khoản</h3>
                    <div className={accMana.containerInfoAccont}>
                        <div className={accMana.areaAvatar}>
                            <img src={
                                    // dataChange.avatar?
                                    // URL.createObjectURL(dataChange.avatar):
                                    // (data as any).avatar? 
                                    // `http://localhost:5000/${(data as any).avatar}`: 
                                    // `http://localhost:5000/default_image.jpg`
                                    dataState?.avatar?
                                    `${API_BASE_URL}/${dataState?.avatar}`:
                                    dataChange.avatar?
                                    URL.createObjectURL(dataChange.avatar):
                                    (data as any).avatar? 
                                    `${API_BASE_URL}/${(data as any).avatar}`: 
                                    `${API_BASE_URL}/default_image.jpg`
                                } 
                                alt=""
                            />
                            <div 
                                className={accMana.divUploadAvatar}
                                onClick={handleClickDivImg}
                            >
                                <i className="fa-solid fa-camera-retro"></i>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setDataChange({
                                                ...dataChange,
                                                avatar: file
                                            });
                                        }
                                    }}
                                    style={{ display: 'none' }}
                                />
                            </div>
                        </div>
                        <div className={accMana.areaInfoAccount}>
                            <input 
                                type="text"
                                name="fullname"
                                value={
                                    // dataChange.fullname===''? 
                                    // (data as any)?.fullname: 
                                    // dataChange.fullname
                                    dataChange.fullname===''?
                                    dataState?.fullname?
                                    dataState?.fullname:
                                    (data as any)?.fullname:
                                    dataChange.fullname
                                }
                                onChange={handleChange}
                                style={{
                                    display: showChangePwd? 'none': 'block'
                                }}
                            />
                            <input 
                                type="text"
                                name="username"
                                value={
                                    dataChange.username===''? 
                                    dataState?.username?
                                    dataState?.username:
                                    (data as any)?.username: 
                                    dataChange.username
                                }
                                onChange={handleChange}
                                style={{
                                    display: showChangePwd? 'none': 'block'
                                }}
                            />
                            <input 
                                type="email"
                                name="email"
                                value={
                                    dataChange.email===''? 
                                    dataState?.email?
                                    dataState?.email:
                                    (data as any)?.email? 
                                    (data as any)?.email: 
                                    'Không có': 
                                    dataChange.email
                                }
                                onChange={handleChange}
                                style={{
                                    display: showChangePwd? 'none': 'block'
                                }}
                            />
                            <input 
                                type="text"
                                name="role"
                                value={
                                    dataState?.role?
                                    dataState?.role:
                                    (data as any)?.role
                                }
                                onChange={handleChange}
                                readOnly
                                style={{
                                    display: showChangePwd? 'none': 'block'
                                }}
                            />
                            <input 
                                type="text" 
                                name="oldpass"
                                value={password.oldpass}
                                onChange={handleChange}
                                placeholder="Mật khẩu cũ"
                                style={{
                                    display: showChangePwd? 'block': 'none'
                                }}
                            />
                            <input 
                                type="text" 
                                name="newpass"
                                value={password.newpass}
                                onChange={handleChange}
                                placeholder="Mật khẩu mới"
                                style={{
                                    display: showChangePwd? 'block': 'none'
                                }}
                            />
                            <span 
                                onClick={handleClickSpanChangePwd}
                                style={{
                                    display: showChangePwd? 'none': 'block'
                                }}
                            >
                                    Đổi mật khẩu
                            </span>
                            <div className={accMana.areaBtn}>
                                <button onClick={showChangePwd? handleChangePwd: handleClickSave}>Lưu</button>
                                <button onClick={showChangePwd? handleClickSpanChangePwd: handleClickCancel}>Hủy</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default AccountListView;