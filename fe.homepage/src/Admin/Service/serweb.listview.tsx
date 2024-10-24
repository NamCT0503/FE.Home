import style from "../../css.module/admin/service.package.module.css"
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { ServiceWebEntity } from "../../types/app.types";
import { sendReq } from "../../Sign";
import API_ROUTER from "../../router/router";

interface SerWeb {
    data: ServiceWebEntity[]
}

const SerWebListView = (props: SerWeb) => {
    const [opacityBtnCreate, setOpacityBtnCreate] = useState(1);
    const [zIndexBtnCreate, setZIndexBtnCreate] = useState(2);
    const [widthInputCreate, setWidthInputCreate] = useState('0');
    const [opacityDivCreate, setOpacityDivCreate] = useState(0);
    const [edit, setEit] = useState<number>();
    const [dataChange, setDataChange] = useState({
        id: edit,
        title: '',
        price: ''
    });
    const [dataCreate, setDataCreate] = useState({
        c_title: '',
        c_price: ''
    });

    const {data} = props;
    const navigate = useNavigate();

    const handleViewContent = (idRecord: number) => {
        navigate(`content/recordId=${idRecord}`, { state: {
            type: 'web',
            id: idRecord
        }});
    }

    const handleEdit = (data: ServiceWebEntity) => {
        setEit(data.id);
        setDataChange({
            id: data.id,
            title: data.title,
            price: data.price
        })
    }

    const handleCancelEdit = (data: ServiceWebEntity) => {
        setEit(0);
        setDataChange({
            id: data.id,
            title: data.title,
            price: data.price
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
            const url = API_ROUTER.UPDATE_SERWEB;
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
            // const url = 'http://localhost:5000/api/homepage/service/web/delete';
            const url = API_ROUTER.DELETE_SERWEB;
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
        // const url = 'http://localhost:5000/api/homepage/service/web/create';
        const url = API_ROUTER.CREATE_SERWEB;
        try {
            const res = await sendReq(url, {
                method: "POST",
                body: JSON.stringify({
                    title: dataCreate.c_title,
                    price: dataCreate.c_price
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
                    <th>Tiêu đề</th>
                    <th>Giá thành</th>
                    <th>Tùy chọn</th>
                </tr>
                <tbody>
                    {data.map(items => {
                        return(
                            <tr key={items.id}>
                                <td>{items.id}</td>
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
                                            name="price"
                                            type="text" 
                                            style={{width: '70%'}} 
                                            value={
                                                (dataChange.price && dataChange.price !== '')?
                                                dataChange.price: items.price
                                            }
                                            onChange={handleDataChange}
                                        />:
                                        items.price
                                    }
                                </td>
                                <td className={style.areaButton}>
                                    <button 
                                        className={style.btnView}
                                        onClick={() => handleViewContent(items.id)}
                                        hidden={edit===items.id? true: false}
                                    >
                                        <i className="fa-solid fa-eye"></i>
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
            {data.length<4? <div className={style.areaCreate}>
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
                    name="c_price" 
                    style={{
                        width: widthInputCreate
                    }}
                    placeholder="Giá thành"
                    value={dataCreate.c_price}
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

export default SerWebListView;