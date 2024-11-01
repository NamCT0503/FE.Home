import { useEffect, useState } from "react";
import API_ROUTER from "./router/router";

const ServiceSection = () => {
    const [spanWebBg, setSpanWebBg] = useState('#222222');
    const [spanWebColor, setSpanWebColor] = useState('white');
    const [spanAppBg, setSpanAppBg] = useState('#f5f5f5');
    const [spanAppColor, setSpanAppColor] = useState('#797979');
    const [rotateYCardInner, setRotateYCardInner] = useState('rotateY(0)');
    const [displayEsDiff, setDisplayEsDiff] = useState<string>();

    const [dataSerWeb, setDataSerWeb] = useState<any[]>();
    const [filterDataWeb, setFilterDateWeb] = useState<any[]>();
    const [dataSerApp, setDataSerApp] = useState<any[]>();
    const [filterDataApp, setFilterDateApp] = useState<any[]>();

    let arrDomFront: any[] = [];
    let arrDomBack: any[] = [];

    const fetchData = async (url: string, isWeb: boolean) => {
        try {
            const res = await fetch(url, {
                method: "GET"
            });
            const data = await res.json();

            if(isWeb){
                const filData = await data?.filter((items: any, index: any, self: any) => 
                    index === self?.findIndex((filter: any) => filter.serweb_id === items.serweb_id)
                ); 
                setDataSerWeb(data);
                setFilterDateWeb(filData);
            } else {
                const filData = await data?.filter((items: any, index: any, self: any) => 
                    index === self?.findIndex((filter: any) => filter.serapp_id === items.serapp_id)
                ); 
                setDataSerApp(data);
                setFilterDateApp(filData);
            }
        } catch (error) {
            console.log('Fetch Error: ', error);
        }
    }

    const checkDomES = () => {
        const esDom = document.querySelectorAll('.es-diffirent');
        if(esDom){
            esDom.forEach(dom => {
                const innerDom = dom.querySelector('.es-card-inner');
                if(innerDom){
                    const layotDiff = innerDom.querySelector('.es-card-front');
                    layotDiff? arrDomFront.push(10): arrDomBack.push(10);
                }

            });

            if(arrDomBack.length!==0) return 'back';
            else if(arrDomFront.length!==0) return 'front';
            else return undefined;
        }
        return undefined;
    }

    useEffect(() => {
        fetchData(API_ROUTER.GET_CONTENTWEB, true);
        fetchData(API_ROUTER.GET_CONTENTAPP, false);
    }, [])

    useEffect(() => {
        const diffirent = checkDomES();
        setDisplayEsDiff(diffirent==='front'? 'block': 'none');
    }, [dataSerWeb])

    const handleClickFrontCard = () => {
        setTimeout(() => {
            setSpanWebBg('#222222');
            setSpanWebColor('white');
            setSpanAppBg('#f5f5f5');
            setSpanAppColor('#797979');
            setRotateYCardInner('rotateY(0)');
        }, 0.1);
        if(filterDataApp && filterDataWeb){
            if(filterDataApp.length<filterDataWeb.length){
                setDisplayEsDiff('none')
            } else setDisplayEsDiff('block');
        }
    }

    const handleClickBackCard = () => {
        setTimeout(() => {
            setSpanAppBg('#222222');
            setSpanAppColor('white');
            setSpanWebBg('#f5f5f5');
            setSpanWebColor('#797979');
            setRotateYCardInner('rotateY(180deg)');
        }, 0.1)
        if(filterDataWeb && filterDataApp){
            if(filterDataWeb.length< filterDataApp.length){
                setDisplayEsDiff('none')
            } else setDisplayEsDiff('block')
        }
    }

    return(
        <section id="e-service">
            <div className="es-container">
            <h2 className="text-uppercase">Service</h2>
                <div className="es-container es-col">
                    <div className="es-row es-row-title">
                        <span 
                            className="es-content"
                            onClick={handleClickFrontCard}
                            style={{
                                backgroundColor: spanWebBg,
                                color: spanWebColor
                            }}
                        >
                            Mobile
                        </span>
                        <span 
                            className="es-content"
                            onClick={handleClickBackCard}
                            style={{
                                backgroundColor: spanAppBg,
                                color: spanAppColor
                            }}
                        >
                            Website
                        </span>
                    </div>
                    <div className="es-row es-package">
                        {
                            filterDataApp?.length! >= filterDataWeb?.length! ?

                            filterDataApp?.map((items, idx) => {
                                const content = dataSerApp?.filter(data => data.serapp_id === items.serapp_id)
                                .map(data => ({
                                    icon: data.icon,
                                    content: data.content
                                }));

                                // let subClass: string;
                                // if(items.type === 'Personal') subClass = 'personal';
                                // if(items.type === 'Professional') subClass = 'professional';
                                // if(items.type === 'Business') subClass = 'business';

                                const webItem = filterDataWeb?.[idx];
                                const contentWeb = dataSerWeb
                                    ?.filter(data => data.serweb_id === webItem?.serweb_id)
                                    ?.map(data => data.content);

                                let subClassWeb = '';
                                if (webItem?.title?.includes('CƠ BẢN')) subClassWeb = 'basic';
                                if (webItem?.title?.includes('SEO')) subClassWeb = 'seo';
                                if (webItem?.title?.includes('BÁN HÀNG')) subClassWeb = 'sup-sale';
                                if (webItem?.title?.includes('CHUYÊN NGHIỆP')) subClassWeb = 'pro';

                                return(
                                    <div 
                                        className={webItem? 'es-card': 'es-card es-diffirent'}
                                        style={{
                                            display: webItem? 'block': displayEsDiff
                                        }}
                                    >
                                        <div 
                                            className="es-card-inner"
                                            style={{
                                                transform: rotateYCardInner
                                            }}
                                        >
                                            <div className="es-card-front">
                                               <span>{items.type}</span>
                                                <div className="contact-services-app">
                                                    <h1>{items.title}</h1>
                                                    <h3>{items.subtitle}</h3>
                                                </div>
                                                <div className="content-package-app">
                                                    {content?.map(items => {
                                                        return(
                                                        <div className="content-line">
                                                            <i className={`${items.icon}`}></i>
                                                            <p>{items.content}</p>
                                                        </div>
                                                        )
                                                    })}
                                                </div>
                                                <button><i className="fa-solid fa-phone"></i>Gọi ngay!</button> 
                                            </div>
                                            {webItem && (
                                                <div className="es-card-back">
                                                    <div className={`package-web ${subClassWeb}`}>
                                                        <p className="prices-web">{webItem.price}</p>
                                                        <p className="types-web">{webItem.title}</p>
                                                        <div className="type-package-web">TRỌN GÓI</div>
                                                        <div className="content-package-web">
                                                            {contentWeb?.map((cont, contIdx) => (
                                                                <div key={contIdx} className="content-in-package-web">
                                                                    <p>{cont}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <input type="button" value="Đăng ký" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            }) :

                            filterDataWeb?.map((webs, idx) => {
                                let subClassWeb= '';

                                const content = dataSerWeb?.filter((data) => data.serweb_id === webs.serweb_id).map((data) => data.content);
                                  
                                if(webs.title?.includes('CƠ BẢN')) subClassWeb = 'basic';
                                if(webs.title?.includes('SEO')) subClassWeb = 'seo'
                                if(webs.title?.includes('BÁN HÀNG')) subClassWeb = 'sup-sale'
                                if(webs.title?.includes('CHUYÊN NGHIỆP')) subClassWeb = 'pro'

                                const appItem = filterDataApp?.[idx];
                                // let subClass= '';
                                const contentApp = dataSerApp?.filter(data => data.serapp_id === appItem?.serapp_id)
                                .map(data => ({
                                    icon: data.icon,
                                    content: data.content
                                }));

                                return(
                                    <div 
                                        className={appItem? 'es-card': 'es-card es-diffirent'}
                                        style={{
                                            display: appItem? 'block': displayEsDiff
                                        }}
                                    >
                                        <div 
                                            className="es-card-inner"
                                            style={{
                                                transform: rotateYCardInner
                                            }}
                                        >
                                            <div className="es-card-back">
                                                <div className={`package-web ${subClassWeb}`}>
                                                    <p className="prices-web">{webs.price}</p>
                                                    <p className="types-web">{webs.title}</p>
                                                    <div className="type-package-web">TRỌN GÓI</div>
                                                    <div className="content-package-web">
                                                        {content?.map(conts => {
                                                            return(
                                                            <div className="content-in-package-web">
                                                                <p>- {conts}</p> 
                                                            </div>
                                                            )
                                                        })}
                                                    </div>
                                                    <input type="button" value="Đăng ký" />
                                                </div>
                                            </div>
                                            {appItem && (
                                                <div className="es-card-front">
                                                <span>{appItem.type}</span>
                                                <div className="contact-services-app">
                                                    <h1 style={{
                                                        fontSize: '35px',
                                                        fontWeight: 600
                                                    }}>{appItem.title}</h1>
                                                    <h3 style={{
                                                        fontSize: '30px',
                                                        fontWeight: 600,
                                                        marginTop: '-10px',
                                                        marginBottom: '10px'
                                                    }}>{appItem.subtitle}</h3>
                                                </div>
                                                <div className="content-package-app">
                                                    {contentApp?.map(items => {
                                                        return(
                                                        <div className="content-line">
                                                            <i className={`${items.icon}`}></i>
                                                            <p>{items.content}</p>
                                                        </div>
                                                        )
                                                    })}
                                                </div>
                                                <button><i className="fa-solid fa-phone"></i>Gọi ngay!</button> 
                                            </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ServiceSection;