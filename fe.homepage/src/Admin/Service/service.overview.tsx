import style from "../../css.module/admin/service.web.module.css";
import { useNavigate } from "react-router-dom";

const ServiceOverview = () => {
    const navigate =  useNavigate();
    
    const handleNavigate = (to: string) => {
        navigate(to);
    }

    return(
        <>
        <div className={style.wrapContainerLayoutMain}>
            <div className={style.wrapContainerTitlePage}>
                <div className={style.leftContentTitlePage}>
                    <div className={style.iconTitlePage}>
                        <i className="fa-solid fa-briefcase"></i>
                    </div>
                    <div className={style.contentTitlePage}>
                        <span className={style.titlePage}>Dịch vụ</span>
                        <span>Trang quản lý dịch vụ cung cấp</span>
                    </div>
                </div>
                <div className={style.rightContentTitlePage}>
                    <i className="fa-solid fa-briefcase"></i>
                    <span>Dịch vụ</span>
                </div>
            </div>
            <div className={style.wrapContainerLayoutContent}>
                <div className={style.containerLayoutContent}>
                    <div 
                        className={style.layoutContent}
                        onClick={() => handleNavigate('website')}
                    >
                        <i className="fa-solid fa-window-maximize"></i>
                        <span>Website</span>
                        <div className={style.tesr}></div>
                    </div>
                    <div 
                        className={style.layoutContent}
                        onClick={() => handleNavigate('mobile')}
                    >
                        <i className="fa-solid fa-mobile"></i>
                        <span>Mobile</span>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default ServiceOverview;