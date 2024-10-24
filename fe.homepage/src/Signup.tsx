import { Helmet } from "react-helmet";
// import style from "../css.module/signup.module.css";
import style from "../src/css.module/signin.module.css";
import signup from "../src/css.module/signup.module.css";
import { DotLottie } from "@lottiefiles/dotlottie-web";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendReq } from "./Sign";
import API_ROUTER from "./router/router";

// const url = 'http://localhost:5000/api/homepage/signup';
const url = API_ROUTER.SIGNUP;

const SignupLayout = () => {
    const [tagI, setTagI] = useState('fa-regular fa-eye-slash');
    const [showHidenPass, setShowHiddenPass] = useState('password');
    const [dataForm, setDataForm] = useState({
        fullname: '',
        username: '',
        password: '',
        avatar: '' as any,
        email: '',
        role: 'admin'
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
            const res = await sendReq(url, {
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
                    return console.log('Signup Failed: ', status);
                }

                navigate('/admin/accounts');
            } else {
                alert(status.message);
                console.log(status)
            }
        } catch (error) {
            console.log('Signup Error: ', error);
        }
    }

    const changeDataForm = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        setDataForm({
            ...dataForm,
            [e.target.name]: e.target.value
        });
    }

    const handleChooseRole = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setDataForm({
            ...dataForm,
            role: e.target.value
        })
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
            <div className={`${style.containerAuth} ${signup.wrapSignup}`}>
                <canvas 
                    id="background-auth" 
                    style={{
                        width: '600px', 
                        height: '600px',
                        position: 'absolute',
                        zIndex: 1
                    }}>
                </canvas>
                <div className={style.wrapFormAuth}>
                    <form action="" className={style.formAuth} onSubmit={handleSubmit}>
                        <h2>Đăng ký tài khoản mới</h2>
                        <div className={style.inputIn4}>
                            <input 
                                type="text" 
                                name="fullname" 
                                value={dataForm.fullname} 
                                onChange={changeDataForm}
                                required 
                            />
                            <label htmlFor="">Họ tên</label>
                        </div>
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
                        <div className={style.inputIn4}>
                            <input 
                                type="text" 
                                name="email" 
                                value={dataForm.email} 
                                onChange={changeDataForm}
                                required 
                            />
                            <label htmlFor="">Email</label>
                        </div>
                        <div className={style.inputIn4}>
                            <select name="role" onChange={handleChooseRole}>
                                <option value="admin">Admin</option>
                                <option value="superadmin">Superadmin</option>
                            </select>
                        </div>
                        <button>Đăng ký</button>
                    </form>
                </div>
            </div>
        </div>
        </>
    )
}

export default SignupLayout;