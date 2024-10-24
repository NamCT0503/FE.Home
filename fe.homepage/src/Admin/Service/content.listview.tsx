import { useEffect, useState } from "react"
import style from "../../css.module/admin/service.package.module.css"
import { ContentMobileEntity, ContentWebEntity } from "../../types/app.types"
import { useLocation } from "react-router-dom"
import { sendReq } from "../../Sign"
import API_ROUTER from "../../router/router"

const ContentListview = () => {
    const location = useLocation();
    const type = location.state.type;
    const id = location.state.id;
    
    const [data, setData] = useState<any>([]);
    const [edit, setEit] = useState<number>();
    const [dataChange, setDataChange] = useState<any>({
        id: edit,
        serweb_id: id,
        icon: '',
        content: ''
    });

    useEffect(() => {
        fetchData(type!, id!);
    }, [location]);

    const fetchData = async (type: string, id: number) => {
        try {
            // const url = `http://localhost:5000/api/homepage/service/${type}/get-content/${id}/:ref`
            const url = API_ROUTER.GET_CONTENTWEB.replace('/web/', `/${type}/`).replace(':id', id.toString()).replace('ref', ':ref');
            const res = await fetch(url, {
                method: "GET"
            });
            const dataRes = await res.json();
            setData(dataRes);
        } catch (error) {
            console.log('Fetch Error: ', error);
        }
    }

    const handleEdit = (data: any) => {
        setEit(data.id);
        setDataChange({
            id: data.id,
            serweb_id: id,
            icon: data.icon? data.icon: null,
            content: data.content
        });
    }

    const handleCancelEdit = (data: any) => {
        setEit(0);
        setDataChange({
            id: data.id,
            serweb_id: id,
            icon: data.icon? data.icon: null,
            content: data.content
        });
    }

    const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        setDataChange({
            ...dataChange,
            [e.target.name]: e.target.value
        });
    }

    const handleSaveEdit = async () => {
        try {
            let url: string;
            if(type === 'web') 
                // url = 'http://localhost:5000/api/homepage/service/web/content/update';
                url = API_ROUTER.UPDATE_CONTENTWEB;
            if(type === 'app') 
                // url = 'http://localhost:5000/api/homepage/service/app/content/update';
                url = API_ROUTER.UPDATE_CONTENTAPP;
            const res = await sendReq(url!, {
                method: 'PUT',
                body: JSON.stringify(dataChange)
            });

            const dataRes = await res.json();
            setEit(0);
            return alert(dataRes.message);
        } catch (error) {
            console.log('Update Error: ', error);
        }
    }

    const handleDelete = async (id: number) => {
        try {
            let url: string, res: any;
            if(type === 'web'){
                // url = 'http://localhost:5000/api/homepage/service/web/content/delete';
                url = API_ROUTER.DELETE_CONTENTWEB
                res = await sendReq(url!, {
                    method: 'DELETE',
                    body: JSON.stringify({ id: id})
                });
            }
            if(type === 'app'){
                // url = 'http://localhost:5000/api/homepage/service/app/content/delete';
                url = API_ROUTER.DELETE_CONTENTAPP;
                res = await sendReq(url!, {
                    method: 'DELETE',
                    body: JSON.stringify({ param_id: id})
                });
            }

            const dataRes = await res.json();
            return alert(dataRes.message);
        } catch (error) {
            console.log('Delete Error: ', error);
        }
    }

    return(
        <div className={style.wrapTable}>
            <table>
                <tbody>
                    {data[0]?.serweb_id? data.map((items: ContentWebEntity) => {
                        return(
                            <tr>
                                <td>
                                    {
                                        edit===items.id? 
                                        <input 
                                            name="content"
                                            type="text" 
                                            style={{width: '70%'}}
                                            value={
                                                (dataChange.content && dataChange.content !== '')?
                                                dataChange.content: items.content
                                            }
                                            onChange={handleDataChange}
                                        />:
                                        items.content
                                    }
                                </td>
                                <td className={style.areaButton}>
                                    <button 
                                        className={style.btnEdit}
                                        onClick={() => handleEdit(items)}
                                        hidden={edit===items.id? true: false}
                                    >
                                        <i className="fa-solid fa-feather-pointed"></i>
                                    </button>
                                    <button 
                                        className={style.btnDelete}
                                        onClick={() => handleDelete(items.id)}
                                        hidden={edit===items.id? true: false}
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                    <button 
                                        className={style.btnCancel}
                                        onClick={() => handleCancelEdit(items)}
                                        hidden={edit===items.id? false: true}
                                    >
                                        <i className="fa-solid fa-xmark"></i>
                                    </button>
                                    <button 
                                        className={style.btnSave}
                                        onClick={handleSaveEdit}
                                        hidden={edit===items.id? false: true}
                                    >
                                        <i className="fa-solid fa-floppy-disk"></i>
                                    </button>
                                </td>
                            </tr>
                        )
                    }): data.map((items: ContentMobileEntity) => {
                        return(
                            <tr className={style.contentPackage}>
                                <td>Icon: 
                                    {
                                        edit===items.id?
                                        <input 
                                            name="icon"
                                            type="text"
                                            style={{ width: '70%'}}
                                            value={
                                                (dataChange.icon && dataChange.icon !== '')?
                                                dataChange.icon: items.icon
                                            }
                                            onChange={handleDataChange}
                                        />:
                                        <i className={items.icon}></i>
                                    }
                                </td>
                                <td>
                                    {
                                        edit===items.id? 
                                        <input 
                                            name="content"
                                            type="text" 
                                            style={{width: '70%'}}
                                            value={
                                                (dataChange.content && dataChange.content !== '')?
                                                dataChange.content: items.content
                                            }
                                            onChange={handleDataChange}
                                        />:
                                        items.content
                                    }
                                </td>
                                <td className={style.areaButton}>
                                    <button 
                                        className={style.btnEdit}
                                        onClick={() => handleEdit(items)}
                                        hidden={edit===items.id? true: false}
                                    >
                                        <i className="fa-solid fa-feather-pointed"></i>
                                    </button>
                                    <button 
                                        className={style.btnDelete}
                                        onClick={() => handleDelete(items.id)}
                                        hidden={edit===items.id? true: false}
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                    <button 
                                        className={style.btnCancel}
                                        onClick={() => handleCancelEdit(items)}
                                        hidden={edit===items.id? false: true}
                                    >
                                        <i className="fa-solid fa-xmark"></i>
                                    </button>
                                    <button 
                                        className={style.btnSave}
                                        onClick={handleSaveEdit}
                                        hidden={edit===items.id? false: true}
                                    >
                                        <i className="fa-solid fa-floppy-disk"></i>
                                    </button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default ContentListview;