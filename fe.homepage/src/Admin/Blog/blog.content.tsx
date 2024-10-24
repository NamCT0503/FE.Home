/* eslint-disable */

import React, { useEffect, useRef, useState } from "react";
import style from "../../css.module/admin/blog.content.module.css";
import Cookies from "js-cookie";
import { useLocation } from "react-router-dom";
import { sendReq } from "../../Sign";
import API_ROUTER, { API_BASE_URL } from "../../router/router";

let idRecord: number = 0;
// const url_getContentBlog = 'http://localhost:5000/api/homepage/service/blog/content/get/';
// const url_delContentBlog = 'http://localhost:5000/api/homepage/service/blog/content/delete/'
// const url_updateIsOutstanding = 'http://localhost:5000/api/homepage/service/blog/update';
const url_getContentBlog = API_ROUTER.GETBC.split(':blogid')[0];
const url_delContentBlog = API_ROUTER.DELETEBC.split(':id/:scope')[0];
const url_updateIsOutstanding = API_ROUTER.UPDATE_BLOG;

const BlogContent = () => {
    const accessToken = Cookies.get('accessToken');
    const location = useLocation();
    const pathname = location.pathname;
    const idState = location.state?.id;

    const fileInputRef = useRef<HTMLInputElement>(null);
    const isMounted = useRef(false);
    const [dataBlogCover, setDataBlogCover] = useState({
        img: '' as any,
        title: '',
        description: '',
        tag: '',
        isOutstanding: false
    });
    const [selectedFiles, setSelectedFiles] = useState<{imgid: number, img: File}[]>([]);
    const [idRecordRes, setIdRecordRes] = useState();
    const [alertCrBC, setAlertCrBC] = useState(true);
    const [contentBlog, setContentBlog] = useState<any>([]);

    useEffect(() => {
        const fetchData = async () => { 
            try {
                const response = await fetch(url_getContentBlog + `${idState}`);
                const data = await response.json();

                if (data && data.length > 0) {
                    const uniqueData = Array.from(new Set(data.map((item: any) => item.id)))
                        .map(id => data.find((item: any) => item.id === id));

                    setContentBlog(uniqueData);

                    uniqueData.forEach((item: any) => {
                        handleAddChildElement(item.type_content, item);
                    });
                }
            } catch (error) {
                console.error('Error fetching content blog:', error);
            }
        };

        if (!isMounted.current) {
            fetchData();
            isMounted.current = true;
        }
    }, []);

    const handleClickDivImg = () => {
        fileInputRef.current?.click();
    };

    const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        setDataBlogCover({
            ...dataBlogCover,
            [e.target.name]: e.target.value
        })
    };

    const handleClickOutstanding = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        setDataBlogCover({
            ...dataBlogCover,
            isOutstanding: e.target.checked
        });
    };

    const handleChooseTag = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setDataBlogCover({
            ...dataBlogCover,
            tag: e.target.value
        });
    };

    const handleClickSave = async () => {
        const formData = new FormData();
        
        if(dataBlogCover.title === '' || dataBlogCover.description === '')
            return alert('Vui lòng điền tiêu đề và mô tả cho trang bìa!');

        try {
            formData.append('img', dataBlogCover.img);
            formData.append('title', dataBlogCover.title);
            formData.append('description', dataBlogCover.description);
            formData.append('tag', dataBlogCover.tag);
            formData.append('isOutstanding', String(dataBlogCover.isOutstanding));

            // const url = 'http://localhost:5000/api/homepage/service/blog/create';
            const url = API_ROUTER.CREATE_BLOG;
            const res = await fetch(url, {
                method: "POST",
                body: formData,
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                }
            });

            const dataRes = await res.json();
            setIdRecordRes(dataRes.idRecord.id);
            return alert(dataRes.message);
        } catch (error) {
            console.log('Create Error: ', error);
        }
    }

    
    const handleAddChildElement  = (type: string, dataUpdate?: any) => {
        const node: any = document.querySelector(`.${style.areaContentBlog}`);
        let childElement :any = document.createElement('div');; 
        childElement.id = dataUpdate? `${type}update${dataUpdate.id}_${idRecord+=1}`: `${type}_${idRecord+=1}`;
        childElement.contentEditable = 'true'; 

        if(type === 'image'){
            childElement.className = style.childDivImg;

            const inputFile = document.createElement('input');
            inputFile.type = 'file';
            
            const img = document.createElement('img');
            img.className = style.childImg;
            // img.src = dataUpdate?.content;
            img.src = `${API_BASE_URL}/${dataUpdate?.content}`

            inputFile.onchange = (event: any) => {
                const file = event.target.files[0];
                
                img.src = URL.createObjectURL(file);
                setSelectedFiles((prevFiles) => {
                    const existingFile = prevFiles.find(item => item.imgid === childElement.id);
                    if (existingFile) {
                        return prevFiles.map(item =>
                            item.imgid===childElement.id? { ...item, img: file }: item
                        );
                    } else {
                        return [...prevFiles, { imgid: childElement.id, img: file }];
                    }
                });
            };

            childElement.appendChild(img);
            childElement.appendChild(inputFile);
        } else {
            childElement.innerHTML = dataUpdate? dataUpdate.content: '';
            if(type === 'text' || type === 'textul' || type === 'textol'){
                childElement.className = style.childElementText;
            }
            if(type === 'heading'){
                childElement.className = style.childElementHeading;
            }
        }

        childElement.style.margin = '5px 0 5px 0'
        node?.appendChild(childElement);
        delElement(childElement.id)
    }

    const getChildElementIds = () => {
        const parentNode: any = document.querySelector(`.${style.areaContentBlog}`);
        const childElements = parentNode?.querySelectorAll('div');
        const ids = Array.from(childElements).map((element: any) => element.id);
        return ids;
    };

    const getContentById = (id: string) => {
        const idUp = id.includes('update')? id.split('_')[0].split('update')[1]: undefined
        const divElement = document.getElementById(id);
        if (divElement) {
            if(id.includes('image')){
                return {
                    idDiv: idUp,
                    content: divElement.innerText
                };
            }
            return{
                id: id,
                idDiv: idUp,
                text: divElement.innerText
            };
        } else {
            console.log('Div with specified ID not found.');
            return '';
        }
    };

    const handleClickCreateContentBlog = async () => {
        try {
            if(!idRecordRes && !idState) return alert('Bài đăng chưa tồn tại để tạo nội dung!');
            const res = await sendReq(url_updateIsOutstanding, {
                method: "PUT",
                body: JSON.stringify({ 
                    idBlog: idState,
                    isOutstanding: dataBlogCover.isOutstanding
                })
            })
            const dataRes = await res.json();
            if(dataRes.status===200){
                const listId: any[] = getChildElementIds();
                listId.map(items => {
                    const dataById :any = getContentById(items);
                    dataById.idDiv? 
                    postContent(dataById.idDiv,
                        dataById.text? dataById: selectedFiles.filter(item => item.imgid===items), 
                        false
                    ): 
                    postContent(idRecordRes!? idRecordRes: idState, 
                        dataById.text? dataById: selectedFiles.filter(item => item.imgid===items),
                        true
                    )
                })

                if(alertCrBC) return alert('Created Successfully!');
                return alert('Creted Fail!');
            }
            return alert(dataRes.message);
        } catch (error) {
            console.log('Create Error: ', error);
        }
    }

    const delElement = (id: string) => {
        const element = document.getElementById(`${id}`);
        if (!element) return alert('Lỗi DOM!');
    
        let timeout: any = null; 

        element.onmousedown = () => {
            element.style.opacity = '0.5';
            element.dataset.isHolding = 'true';
            timeout = setTimeout(() => {
                if (element.dataset.isHolding === 'true') {
                    const isConfirmed = confirm("Bạn có chắc chắn muốn xóa phần tử này không?");
                    if (isConfirmed) {
                        element.remove(); 
                        if(id.includes('update')){
                            const idNumber = parseInt(id.split('update')[1].split('_')[0]);
                            handleDeleteContentBlog(idNumber);
                        }
                    } else {
                        element.style.opacity = '1'; 
                    }
                }
                delete element.dataset.isHolding; 
            }, 2000);
        };
    
        element.onmouseup = () => {
            clearTimeout(timeout!)
            element.style.opacity = '1'; 
        };
    };

    let stepStt = 0;
    const postContent = async (blogid: string | number, data: any, create: boolean) => {
        // const url_create = 'http://localhost:5000/api/homepage/service/blog/content/create';
        // const url_update = 'http://localhost:5000/api/homepage/service/blog/content/update';
        const url_create = API_ROUTER.CREATEBC;
        const url_update = API_ROUTER.UPDATEBC;

        const formData = new FormData();
        stepStt+=1;
        const newStt = contentBlog[0]?.stt? 
            contentBlog?.at(-1)?.stt+stepStt: 
            data?.id? data?.id.split('_')[1]: 
            data[0]?.imgid.split('_')[1]

        try {
            let res: any;
            if(blogid){
                if(create){
                    if(
                        (data?.text && data?.text !== '') ||
                        (data[0]?.img && data[0]?.img !== '')
                    ){
                        formData.append('blogid', blogid.toString());
                        formData.append('stt', newStt);
                        formData.append('type_content', 
                            data?.id? data?.id.split('_')[0]: 
                            data[0]?.imgid.split('_')[0]
                        );
                        formData.append('content', 
                            data?.text? data.text: data[0]?.img
                        );
                        

                        res = await fetch(url_create, {
                            method: 'POST',
                            body: formData,
                            headers: {
                                'Authorization': `Bearer ${accessToken}`,
                            }
                        });
    
                        const dataRes = await res.json();
                        return dataRes.status===200? setAlertCrBC(true): setAlertCrBC(false);
                    }
                } else {
                    if(
                        (data?.text && data?.text !== '') ||
                        (data[0]?.img && data[0]?.img !== '')
                    ){
                        formData.append('id', blogid.toString());
                        formData.append('type_content', 
                            data?.id? data?.id.split('update')[0]: 
                            data[0]?.imgid.split('update')[0]
                        );
                        formData.append('content', 
                            data?.text? data?.text: data[0]?.img
                        );

                        res = await fetch(url_update, {
                            method: 'PUT',
                            body: formData,
                            headers: {
                                'Authorization': `Bearer ${accessToken}`,
                            }
                        });
    
                        const dataRes = await res.json();
                        return dataRes.status===200? setAlertCrBC(true): setAlertCrBC(false);
                    }
                }
            } 
        }
         catch (error) {
            console.log('Create Error: ', error);
        }
    }

    const handleDeleteContentBlog = async (id: number) => {
        try {
            const url = url_delContentBlog+`${id}`+'/:scope';
            const res = await sendReq(url, {
                method: 'DELETE',
            });
            const dataRes = await res.json();
            return dataRes?.message;
        } catch (error) {
            console.log('Delete Error: ', error);
        }
    }

    return(
        <div className={style.wrapContainerLayoutContent}>
            <div className={style.wrapContainerCoverPage}>
                <h3>Trang bìa</h3>
                <div className={style.containerContent}>
                    <img 
                        src={
                            (dataBlogCover.img && dataBlogCover.img!=='')?
                            URL.createObjectURL(dataBlogCover.img): 
                            contentBlog[0]?.blogImg? `${API_BASE_URL}/${contentBlog[0].blogImg}`: ''
                        } 
                        alt="Ảnh bìa" 
                    />
                    <div 
                        className={style.divAddImg} 
                        onClick={handleClickDivImg}
                        style={{ display: pathname.includes('recordId=') ? 'none' : 'block' }}
                    >
                        <i className="fa-solid fa-plus"></i>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setDataBlogCover({
                                        ...dataBlogCover,
                                        img: file
                                    });
                                }
                            }}
                            style={{ display: 'none' }}
                        />
                    </div>
                    <div className={style.areaContentCoverPage}>
                        <input 
                            type="text" 
                            placeholder="Tiêu đề"
                            name="title"
                            value={
                                dataBlogCover.title!==''?
                                dataBlogCover.title:
                                contentBlog[0]?.blogTitle? 
                                contentBlog[0]?.blogTitle: ''
                            }
                            onChange={handleDataChange} 
                            readOnly={pathname.includes('recordId=')? true: false}
                        />
                        <input 
                            type="text" 
                            placeholder="Mô tả" 
                            name="description"
                            value={
                                dataBlogCover.description!==''?
                                dataBlogCover.description:
                                contentBlog[0]?.blogDesc? 
                                contentBlog[0]?.blogDesc: ''
                            }
                            onChange={handleDataChange}
                            readOnly={pathname.includes('recordId=')? true: false}
                        />
                        <div className={style.areHorizionCoverPage}>
                            <select 
                                value={
                                    dataBlogCover.tag!==''?
                                    dataBlogCover.tag:
                                    contentBlog[0]?.blogTag? 
                                    contentBlog[0]?.blogTag: ''
                                }
                                name="tag" 
                                onChange={handleChooseTag}
                                disabled={pathname.includes('recordId=')? true: false}
                            >
                                <option value={contentBlog[0]?.blogTag==='website'? 'website': 'mobile'}>
                                    {contentBlog[0]?.blogTag==='website'? 'website': 'mobile'}
                                </option>
                                <option value={contentBlog[0]?.blogTag==='website'? 'mobile': 'website'}>
                                    {contentBlog[0]?.blogTag==='website'? 'mobile': 'website'}
                                </option>
                            </select>
                            <div className={style.areaIsOutstanding}>
                                <label htmlFor="isOutstanding">Bài viết nổi bật: </label>
                                <input 
                                    type="checkbox" 
                                    id="isOutstanding" 
                                    name="isOutstanding" 
                                    checked={ dataBlogCover.isOutstanding
                                        // dataBlogCover.isOutstanding===false? 
                                        // contentBlog[0]?.blogOutstanding
                                        // dataBlogCover.isOutstanding
                                        // true
                                    }
                                    onChange={handleClickOutstanding}
                                />
                            </div>
                            <button 
                                onClick={handleClickSave}
                                style={{ display: pathname.includes('recordId=') ? 'none' : 'block' }}
                            >
                                <i className="fa-solid fa-floppy-disk"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className={style.wrapContainerContentBlog}>
                <div className={style.containerContentBlog}>
                    <h3>Nội dung bài viết</h3>
                    <span>Nội dung được hiển thị theo thứ tự</span>
                    <div className={style.areaContainerContent}>
                        <div className={style.navbarTopContentPage}>
                            <div 
                                className={style.iconNavbarTop}
                                onClick={() => handleAddChildElement('text')}
                            >
                                text
                            </div>
                            <div 
                                className={style.iconNavbarTop}
                                onClick={() => handleAddChildElement('heading')}
                            >
                                <b>heading</b>
                            </div>
                            <div 
                                className={style.iconNavbarTop}
                                onClick={() => handleAddChildElement('textol')}
                            >
                                <i className="fa-solid fa-list-ol"></i>
                            </div>
                            <div 
                                className={style.iconNavbarTop}
                                onClick={() => handleAddChildElement('textul')}
                            >
                                <i className="fa-solid fa-list-ul"></i>
                            </div>
                            <div 
                                className={style.iconNavbarTop}
                                onClick={() => handleAddChildElement('image')}
                            >
                                <i className="fa-solid fa-panorama"></i>
                            </div>
                        </div>
                        <div className={style.areaContentBlog}>

                        </div>
                        <div className={style.btnCreate}>
                            <button onClick={handleClickCreateContentBlog}>
                               <i className="fa-solid fa-floppy-disk"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BlogContent