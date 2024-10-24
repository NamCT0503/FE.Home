import { DotLottie } from "@lottiefiles/dotlottie-web";
import style from "../src/css.module/signin.module.css";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import API_ROUTER from "./router/router";

// const url = 'http://localhost:5000/api/homepage/login';
const url = API_ROUTER.LOGIN;

const SigninLayout = () => {
    const [tagI, setTagI] = useState('fa-regular fa-eye-slash');
    const [showHidenPass, setShowHiddenPass] = useState('password');
    const [dataForm, setDataForm] = useState({
        username: '',
        password: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        const canvasElement = document.querySelector('#background-auth');

        if(canvasElement){
            new DotLottie({
                autoplay: true,
                loop: true,
                canvas: canvasElement as HTMLCanvasElement,
                src: "https://lottie.host/825d69ba-cc41-40c3-941e-73739e7d1e92/tJt1sQn13V.lottie"
            });
        } else {
            console.log('NotFound Canvas Element!');
        }
    }, []);

    const handleClickShowHidePass = () => {
        if(tagI === 'fa-regular fa-eye-slash'){
            setTagI('fa-regular fa-eye');
            setShowHiddenPass('text');
        } else {
            setTagI('fa-regular fa-eye-slash');
            setShowHiddenPass('password');
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await fetch(url, {
                method: "POST",
                body: JSON.stringify(dataForm),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const status = await res.json();

            if(res.ok){
                if(status.status === 400 || status.status === 500){
                    alert(status.message);
                    return console.log('Login Failed: ', status);
                }

                Cookies.set('roleAccount', status.role);
                Cookies.set('subAccount', status.sub);
                Cookies.set('accessToken', status.accessToken);
                navigate('/admin/index');
            } else {
                alert(status.message);
                console.log(status)
            }
        } catch (error) {
            console.log('Login Error: ', error);
        }
    }

    const changeDataForm = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        setDataForm({
            ...dataForm,
            [e.target.name]: e.target.value
        });
    }

    return(
        <>
        <Helmet>
            <style>{`
                body, html {
                    overflow: hidden;
                    background-image: linear-gradient(to right, rgba(255,0,0,0), rgba(255,0,0,0.2));
                }
            `}</style>
        </Helmet>
        <div className={style.wrapcontainerAuth}>
                <div className={style.containerAuth}>
                    <canvas 
                        id="background-auth" 
                        style={{
                            width: '480px', 
                            height: '480px',
                            position: 'absolute',
                            zIndex: 1
                        }}>
                    </canvas>
                    <div className={style.wrapFormAuth}>
                        <form action="" className={style.formAuth} onSubmit={handleSubmit}>
                            <h2>Đăng nhập</h2>
                            <div className={style.inputIn4}>
                                <input 
                                    type="text" 
                                    name="username" 
                                    value={dataForm.username} 
                                    onChange={changeDataForm}
                                    required 
                                />
                                <label htmlFor="">Tài khoản</label>
                            </div>
                            <div className={style.inputIn4}>
                                <input 
                                    type={showHidenPass} 
                                    name="password" 
                                    value={dataForm.password} 
                                    onChange={changeDataForm}
                                    required 
                                />
                                <label htmlFor="">Mật khẩu</label>
                                <i className={tagI} onClick={handleClickShowHidePass}></i>
                            </div>
                            <span>
                                <a href="">Quên mật khẩu?</a>
                            </span>
                            <button>Đăng nhập</button>
                        </form>
                    </div>
                </div>
        </div>
        </>
    )
}

export const sendReq = async (url: string, options: RequestInit = {}) => {
    const accessToken = Cookies.get('accessToken');

    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
    };

    return fetch(url, {
        ...options,
        headers,
    });
};

export default SigninLayout;