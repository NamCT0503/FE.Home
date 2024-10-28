import { useLocation, useNavigate } from "react-router-dom";
import style from "../../css.module/admin/service.package.module.css";
import parent from "../../css.module/admin/service.web.module.css"
import { useState } from "react";
import { sendReq } from "../../Sign";
import API_ROUTER from "../../router/router";
import ContentListview from "./content.listview";

const ContentPackage = () => {
    const [opacityBtnCreate, setOpacityBtnCreate] = useState(1);
    const [zIndexDivCreate, setZIndexDivCreate] = useState(2);
    const [widthInputCreate, setWidthInputCreate] = useState('0');
    const [opacityAreaEditC, setOpacityAreaEditC] = useState(0);
    // const [edit, setEit] = useState<number>();
    const [dataCreate, setDataCreate] = useState({
        c_icon: '',
        c_content: '',
    });

    const navigate = useNavigate();
    const location = useLocation();
    const type = location.state.type;
    const id = location.state.id;

    const handleNavigate = (to: string) => {
        navigate(to);
    }

    const handleClickBtnCreate = () => {
        setOpacityBtnCreate(opacity => opacity === 1? opacity = 0: opacity = 1);
        setZIndexDivCreate(zindex => zindex === 2? zindex = 1: zindex = 2);
        setWidthInputCreate(width => width === '0'? width = '25%': width = '0');
        setOpacityAreaEditC(opacity => opacity === 0? opacity = 1: opacity = 0);
    }

    const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        setDataCreate({
            ...dataCreate,
            [e.target.name]: e.target.value
        });
    }

    const handleCreate = async () => {
        try {
            let url: string, res: any;
            if(type === 'web'){
                // url = 'http://localhost:5000/api/homepage/service/web/content/create';
                url = API_ROUTER.CREATE_CONTENTWEB;
                res = await sendReq(url, {
                    method: 'POST',
                    body: JSON.stringify({
                        serweb_id: id,
                        content: dataCreate.c_content
                    })
                });
            } else {
                // url = 'http://localhost:5000/api/homepage/service/app/content/create';
                url = API_ROUTER.CREATE_CONTENTAPP
                res = await sendReq(url, {
                    method: 'POST',
                    body: JSON.stringify({
                        serapp_id: id,
                        icon: dataCreate.c_icon,
                        content: dataCreate.c_content
                    })
                });
            }
            const dataRes = await res.json();
            // setEit(0);
            return alert(dataRes.message);
        } catch (error) {
            console.log('Create Error: ', error);
        }
    }

    return(
        <>
        <div className={parent.wrapContainerLayoutMain}>
            <div className={parent.wrapContainerTitlePage}>
                <div className={parent.leftContentTitlePage}>
                    <div className={parent.iconTitlePage}>
                        {
                            type==='web'? 
                            <i className="fa-solid fa-window-maximize"></i>:
                            <i className="fa-solid fa-mobile"></i>
                        }
                    </div>
                    <div className={parent.contentTitlePage}>
                        <span className={parent.titlePage}>
                            {type==='web'? 'Website': 'Mobile'}
                        </span>
                        <span>
                            Trang quản lý dịch vụ {
                                type==='web'? 'website': 'mobile'
                            }
                        </span>
                    </div>
                </div>
                <div className={parent.rightContentTitlePage}>
                    <i 
                        className="fa-solid fa-briefcase"
                        onClick={() => handleNavigate('../service')}
                    >
                    </i>
                    <span 
                        className={parent.service}
                        onClick={() => handleNavigate(type==='web'? '../service/website': '../service/mobile')}
                    >
                        {type==='web'? 'Website': 'Mobile'}
                    </span>
                    <span>
                        Bản ghi {id}
                    </span>
                </div>
            </div>
            <div className={`${style.areaCreate} ${style.contentCreate}`}>
                <div 
                    className={style.divWrapBtnCreate}
                    style={{
                        zIndex: zIndexDivCreate
                    }}
                >
                    <button 
                        className={style.btnCreate}
                        onClick={handleClickBtnCreate}
                        style={{
                            opacity: opacityBtnCreate
                        }}
                    >
                        <i className="fa-solid fa-plus"></i>
                    </button>
                </div>
                {
                    type==='web'? 
                    <input 
                        type="text"
                        name="c_content"
                        value={dataCreate.c_content}
                        placeholder="Nội dung"
                        onChange={handleDataChange}
                        style={{
                            width: widthInputCreate
                        }}
                    />: 
                    <>
                    <input 
                        type="text"
                        name="c_icon"
                        value={dataCreate.c_icon}
                        placeholder="Classname FontAwesome"
                        onChange={handleDataChange}
                        style={{
                            width: widthInputCreate
                        }}
                    />
                    <input 
                        type="text"
                        name="c_content"
                        value={dataCreate.c_content}
                        placeholder="Nội dung"
                        onChange={handleDataChange}
                        style={{
                            width: widthInputCreate
                        }}
                    />
                    </>
                }
                <div 
                    className={style.cancelAndSaveCreate}
                    style={{
                        opacity: opacityAreaEditC
                    }}
                >
                    <button 
                        className={style.btnCancel}
                        onClick={handleClickBtnCreate}
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                    <button 
                        className={style.btnSave}
                        onClick={handleCreate}
                    >
                        <i className="fa-solid fa-floppy-disk"></i>
                    </button>
                </div>
            </div>
            <div className={style.wrapContainerLayoutContent}>
                {<ContentListview></ContentListview>}
            </div>
        </div>
        </>
    )
}

export default ContentPackage;