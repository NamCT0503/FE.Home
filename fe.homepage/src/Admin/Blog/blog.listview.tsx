/* eslint-disable */

import { BlogsEntity } from "../../types/app.types";
import style from "../../css.module/admin/blog.managenment.module.css";
import serPackage from "../../css.module/admin/service.package.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { sendReq } from "../../Sign";
import API_ROUTER, { API_BASE_URL } from "../../router/router";

interface BlogList {
    data: BlogsEntity[]
}

const BlogListView = (props: BlogList) => {
    const [edit, setEit] = useState<number>();
    const [dataChange, setDataChange] = useState({
        id: edit,
        img: '' as any,
        title: '',
        description: '',
        postedAt: '',
        postedBy: 0,
        tag: '',
        isOutstanding: false
    })

    const navigate = useNavigate();
    const subAccount = Cookies.get('subAccount');

    const {data} = props;
    if(!Array.isArray(data))
        return(
            <div>Tạm không có dữ liệu!</div>
        )

    
    const handleEdit = (data: BlogsEntity) => {
        setEit(data.id);
        setDataChange({
            id: data.id,
            img: data.img,
            title: data.title,
            description: data.description,
            postedAt: data.postedAt as string,
            postedBy: data.postedBy,
            tag: data.tag,
            isOutstanding: data.isOutstanding
        })
    }

    const handleCancelEdit = (data: BlogsEntity) => {
        setEit(0);
        setDataChange({
            id: data.id,
            img: data.img,
            title: data.title,
            description: data.description,
            postedAt: data.postedAt as string,
            postedBy: data.postedBy,
            tag: data.tag,
            isOutstanding: data.isOutstanding
        })
    }

    const handleSaveEdit = async () => {
        try {
            // const url = 'http://localhost:5000/api/homepage/service/blog/update';
            const url = API_ROUTER.UPDATE_BLOG;
            const accessToken = Cookies.get('accessToken');
    
            const formData = new FormData();
            formData.append('id', dataChange.id?.toString() || edit!.toString());
            formData.append('title', dataChange.title);
            formData.append('description', dataChange.description);
            formData.append('postedAt', dataChange.postedAt);
            formData.append('postedBy', dataChange.postedBy.toString());
            formData.append('tag', dataChange.tag);
            formData.append('isOutstanding', dataChange.isOutstanding.toString());
    
            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            if (fileInput?.files?.[0]) {
                formData.append('img', fileInput.files[0]);
            }
    
            const res = await fetch(url, {
                method: 'PUT',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
    
            const dataRes = await res.json();
            setEit(0);
            return alert(dataRes.message);
        } catch (error) {
            console.log('Update Error: ', error);
        }
    };

    const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        setDataChange({
            ...dataChange,
            [e.target.name]: e.target.value
        });
    }

    const handleDelete = async (id: number, postedBy: number) => {
        try {
            const confirmDel = confirm("Hành động này không thể hoàn tác!\nBạn vẫn muốn thực hiện?");
            if(confirmDel){
                // const url = 'http://localhost:5000/api/homepage/service/blog/delete';
                const url = API_ROUTER.DELETE_BLOG;
                const res = await sendReq(url, {
                    method: 'DELETE',
                    body: JSON.stringify({ id: id, postedBy: postedBy})
                });

                const dataRes = await res.json();
                return alert(dataRes.message);
            }
        } catch (error) {
            console.log('Delete Error: ', error);
        }
    }

    const handleViewContent = (idRecord: number) => {
        navigate(`content/recordId=${idRecord}`, { state: {
            type: 'web',
            id: idRecord
        }});
    }

    return(
        <div className={`${serPackage.wrapTable} ${serPackage.blogListView}`}>
            <table>
                <tr className={serPackage.headerTable}>
                    <th>Tiêu đề</th>
                    <th>Ảnh bìa</th>
                    <th>Đoạn giới thiệu</th>
                    <th>Đăng ngày</th>
                    <th>Tác giả</th>
                    <th>Tag</th>
                    <th>Tùy chọn</th>
                </tr>
                <tbody>
                    {data.map(items => {
                        return(
                            <tr 
                                className={
                                    items.isOutstanding? style.tdBlogOutstanding: 
                                    items.postedBy===parseInt(subAccount!)? style.tdOwnSelf: ''
                                }>
                                {/* {items.isOutstanding? <i id={style.pinBlog} className="fa-solid fa-thumbtack"></i>: null} */}
                                <td className={serPackage.tdTitle}>
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
                                <td className={serPackage.tdImg}>
                                    {
                                        edit===items.id? 
                                        <input 
                                            name="img"
                                            type="file" 
                                            style={{width: '70%'}}
                                            // value={
                                            //     (dataChange.img && dataChange.img !== '')?
                                            //     dataChange.img: items.img
                                            // }
                                            // onChange={handleDataChange}
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    setDataChange({
                                                        ...dataChange,
                                                        img: file
                                                    });
                                                }
                                            }}
                                        />:
                                        (items.img? <img src={`${API_BASE_URL}/${items.img}`}/>: "Không có")
                                    }
                                </td>
                                <td className={serPackage.tdDesc}>
                                    {
                                        edit===items.id? 
                                        <input 
                                            name="description"
                                            type="text" 
                                            style={{width: '70%'}}
                                            value={
                                                (dataChange.description && dataChange.description !== '')?
                                                dataChange.description: items.description
                                            }
                                            onChange={handleDataChange}
                                        />:
                                        items.description
                                    }
                                </td>
                                <td>
                                    {
                                        ((items.postedAt as string).split('T')[0])
                                    }
                                </td>
                                <td>{items.postedBy}</td>
                                <td>
                                    {
                                        edit===items.id? 
                                        <input 
                                            name="tag"
                                            type="text" 
                                            style={{width: '70%'}}
                                            value={
                                                (dataChange.tag && dataChange.tag !== '')?
                                                dataChange.tag: items.tag
                                            }
                                            onChange={handleDataChange}
                                        />:
                                        items.tag
                                    }
                                </td>
                                <td className={serPackage.tdOptions}>
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
                                        onClick={() => handleDelete(items.id, items.postedBy)}
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

export default BlogListView;