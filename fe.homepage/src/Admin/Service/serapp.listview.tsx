import { ServiceMobileEntity } from "../../types/app.types";
import style from "../../css.module/admin/service.package.module.css"
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { sendReq } from "../../Sign";
import API_ROUTER from "../../router/router";

interface SerApp {
    data: ServiceMobileEntity[]
}

const SerAppListView = (props: SerApp) => {
    const [opacityBtnCreate, setOpacityBtnCreate] = useState(1);
    const [zIndexBtnCreate, setZIndexBtnCreate] = useState(2);
    const [widthInputCreate, setWidthInputCreate] = useState('0');
    const [opacityDivCreate, setOpacityDivCreate] = useState(0);
    const [edit, setEit] = useState<number>();
    const [dataChange, setDataChange] = useState({
        id: edit,
        type: '',
        title: '',
        subtitle: ''
    });
    const [dataCreate, setDataCreate] = useState({
        c_type: '',
        c_title: '',
        c_subtitle: ''
    });

    const {data} = props;
    const navigate = useNavigate();

    const handleViewContent = (idRecord: number) => {
        console.log(idRecord)
        navigate(`content/recordId=${idRecord}`, { state: {
            type: 'app',
            id: idRecord
        }});
    }

    const handleEdit = (data: ServiceMobileEntity) => {
        setEit(data.id);
        setDataChange({
            id: data.id,
            type: data.type,
            title: data.title,
            subtitle: data.subtitle
        })
    }

    const handleCancelEdit = (data: ServiceMobileEntity) => {
        setEit(0);
        setDataChange({
            id: data.id,
            type: data.type,
            title: data.title,
            subtitle: data.subtitle
        });
    }

    const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        setDataChange({
            ...dataChange,
            [e.target.name]: e.target.value
        });

        setDataCreate({
            ...dataCreate,
            [e.target.name]: e.target.value
        })
    }

    const handleSaveEdit = async () => {
        try {
            // const url = 'http://localhost:5000/api/homepage/service/app/update';
            const url = API_ROUTER.UPDATE_SERAPP;
            const res = await sendReq(url, {
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
            // const url = 'http://localhost:5000/api/homepage/service/app/delete';
            const url = API_ROUTER.DELETE_SERAPP;
            const res = await sendReq(url, {
                method: 'DELETE',
                body: JSON.stringify({ id: id})
            });

            const dataRes = await res.json();
            return alert(dataRes.message);
        } catch (error) {
            console.log('Delete Error: ', error);
        }
    }

    const handleClickBtnCreate = () => {
        setOpacityBtnCreate(opacity => opacity === 1? opacity = 0: opacity = 1);
        setZIndexBtnCreate(zindex => zindex === 2? zindex = 1: zindex = 2);
        setWidthInputCreate(width => width === '0'? width = '25%': width = '0');
        setOpacityDivCreate(opacity => opacity === 0? opacity = 1: opacity = 0);
    }

    const handleCreate = async () => {
        // const url = 'http://localhost:5000/api/homepage/service/app/create';
        const url = API_ROUTER.CREATE_SERAPP;
        try {
            const res = await sendReq(url, {
                method: "POST",
                body: JSON.stringify({
                    type: dataCreate.c_type,
                    title: dataCreate.c_title,
                    subtitle: dataCreate.c_subtitle
                })
            });

            const dataRes = await res.json();
            return alert(dataRes.message);
        } catch (error) {
            console.log('Create Error: ', error);
        }
    }

    return(
        <div className={style.wrapTable}>
            <table>
                <tr className={style.headerTable}>
                    <th>ID</th>
                    <th>Loại</th>
                    <th>Tiêu đề</th>
                    <th>Tiêu đề phụ</th>
                </tr>
                <tbody>
                    {data.map(items => {
                        return(
                            <tr>
                                <td>{items.id}</td>
                                <td>
                                    {
                                        edit===items.id? 
                                        <input 
                                            name="type"
                                            type="text" 
                                            style={{width: '70%'}}
                                            value={
                                                (dataChange.type && dataChange.type !== '')?
                                                dataChange.type: items.type
                                            }
                                            onChange={handleDataChange}
                                        />:
                                        items.type
                                    }
                                </td>
                                <td>
                                    {
                                        edit===items.id? 
                                        <input 
                                            name="title"
                                            type="text" 
                                            style={{width: '70%'}}
                                            value={
                                                (dataChange.title && dataChange.title !== '')?
                                                dataChange.title: items.title
                                            }
                                            onChange={handleDataChange}
                                        />:
                                        items.title
                                    }
                                </td>
                                <td>
                                    {
                                        edit===items.id? 
                                        <input 
                                            name="subtitle"
                                            type="text" 
                                            style={{width: '70%'}}
                                            value={
                                                (dataChange.subtitle && dataChange.subtitle !== '')?
                                                dataChange.subtitle: items.subtitle
                                            }
                                            onChange={handleDataChange}
                                        />:
                                        items.subtitle
                                    }
                                </td>
                                <td className={style.areaButton}>
                                    <button
                                        className={style.btnView}
                                        onClick={() => handleViewContent(items.id)}
                                        hidden={edit===items.id? true: false}
                                    >
                                        <i className="fa-solid fa-eye">
                                        </i>
                                    </button>
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
            {data.length<3? <div className={style.areaCreate}>
                <div 
                    className={style.divWrapBtnCreate}
                    style={{
                        opacity: opacityBtnCreate,
                        zIndex: zIndexBtnCreate
                    }}
                >
                    <button 
                        className={style.btnCreate}
                        onClick={handleClickBtnCreate}
                    >
                        <i className="fa-solid fa-plus"></i>
                    </button>
                </div>
                <input 
                    type="text" 
                    name="c_type"
                    style={{
                        width: widthInputCreate
                    }}
                    placeholder="Loại"
                    value={dataCreate.c_type}
                    onChange={handleDataChange}
                />
                <input 
                    type="text" 
                    name="c_title"
                    style={{
                        width: widthInputCreate
                    }}
                    placeholder="Tiêu đề"
                    value={dataCreate.c_title}
                    onChange={handleDataChange}
                />
                <input 
                    type="text" 
                    name="c_subtitle" 
                    style={{
                        width: widthInputCreate
                    }}
                    placeholder="Tiêu đề phụ"
                    value={dataCreate.c_subtitle}
                    onChange={handleDataChange}
                />
                <div 
                    className={style.cancelAndSaveCreate}
                    style={{
                        opacity: opacityDivCreate
                    }}
                >
                    <button 
                        className={style.btnCancel}
                        onClick={handleClickBtnCreate}
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                    <button className={style.btnSave} onClick={handleCreate}>
                        <i className="fa-solid fa-floppy-disk"></i>
                    </button>
                </div>
            </div>: null}
        </div>
    )
}

export default SerAppListView;