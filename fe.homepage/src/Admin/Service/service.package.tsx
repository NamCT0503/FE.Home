import style from "../../css.module/admin/service.package.module.css";
import parent from "../../css.module/admin/service.web.module.css"
// import SerAppListView from "./serapp.listview";
// import SerWebListView from "./serweb.list.view";
import { useLocation, useNavigate } from "react-router-dom";
import SerWebListView from "./serweb.listview";
import SerAppListView from "./serapp.listview";

interface SerPackageEntity {
    data: any[]
}

const ServicePackage = (props: SerPackageEntity) => {
    const navigate = useNavigate();
    const location = useLocation();

    const {data} = props;
    if(!Array.isArray(data))
        return(
            <div>Tạm không có dữ liệu</div>
        )

    const handleNavigate = (to: string, data?: any) => {
        navigate(to, { state: data});
    }

    return(
        <>
        <div className={parent.wrapContainerLayoutMain}>
            <div className={parent.wrapContainerTitlePage}>
                <div className={parent.leftContentTitlePage}>
                    <div className={parent.iconTitlePage}>
                        {
                            location.pathname.includes('/service/website')? 
                            <i className="fa-solid fa-window-maximize"></i>:
                            <i className="fa-solid fa-mobile"></i>
                        }
                    </div>
                    <div className={parent.contentTitlePage}>
                        <span className={parent.titlePage}>
                            {location.pathname.includes('/service/website')? 'Website': 'Mobile'}
                        </span>
                        <span>
                            Trang quản lý dịch vụ {
                                location.pathname.includes('/service/website')? 'website': 'mobile'
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
                        onClick={() => handleNavigate('../service')}
                    >
                        Dịch vụ
                    </span>
                    <span>
                        {location.pathname.includes('/service/website')? 'Website': 'Mobile'}
                    </span>
                </div>
            </div>
            <div className={style.wrapContainerLayoutContent}>
                {location.pathname.includes('/service/website')? <SerWebListView data={data}></SerWebListView>: <SerAppListView data={data}></SerAppListView>}
            </div>
        </div>
        </>
    )
}

export default ServicePackage;