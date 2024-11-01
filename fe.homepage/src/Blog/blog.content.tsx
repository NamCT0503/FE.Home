/* eslint-disable */

import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import style from "../css.module/blog.content.module.css";
import parent from "../css.module/blogs.module.css";
import { useEffect, useState } from 'react';
import API_ROUTER, { API_BASE_URL } from '../router/router';

const BlogContent = () => {
    const [isSticky, setIsSticky] = useState(true);
    const [dataBC, setDataBC] = useState<any>([]);
    const [dataOrtherBlogs, setDataOrtherBlogs] = useState<any>([]);

    const navigate = useNavigate();
    const location = useLocation();
    const blogData = location.state;

    useEffect(() => {
        window.addEventListener('scroll', viewCurrentClient);
        if(blogData){
            fetcher(blogData.id);
            fetchOrtherBlogs(blogData.id);
        }

        return () => window.removeEventListener('scroll', viewCurrentClient);
    }, [blogData]);
 
    const viewCurrentClient = () => {
        const container = document.querySelector(`.${style.containerContentBC}`);
        const areaTable = document.querySelector(`.${style.areaTableOfContent}`);
        
        if(container && areaTable){
            const containerBottom = container.getBoundingClientRect().bottom;
            const areaTableHeight = areaTable.getBoundingClientRect().height;
            const viewportHeight = window.innerHeight;
            console.log('bt: ', containerBottom);
            console.log('he: ', areaTableHeight);
            console.log('view: ', viewportHeight)

            if (containerBottom <= areaTableHeight) {
                setIsSticky(false);
            } else {
                setIsSticky(true);
            }
        }
    }

    const fetcher = async (id: number) => {
        try {
            // const url =  `http://localhost:5000/api/homepage/service/blog/content/get/${id}`;
            const url = API_ROUTER.GETBC.replace(':blogid', id.toString());
            const res = await fetch(url, {
                method: "GET"
            });

            const data = await res.json();
            setDataBC(data);
        } catch (error) {
            console.log('Fetch Error: ', error);
        }
    }

    const fetchOrtherBlogs = async (id: number, page?: number | string) => {
        try {
            // const url = `http://localhost:5000/api/homepage/service/blog/get-orther-blogs/${id}/${page? page: ':page'}`;
            const url = page? 
                API_ROUTER.GETORTHERBLOG.replace(':id', id.toString()).replace(':page', page.toString()):
                API_ROUTER.GETORTHERBLOG.replace(':id', id.toString());
            const res = await fetch(url, {
                method: "GET"
            });

            const data = await res.json();
            setDataOrtherBlogs(data);
        } catch (error) {
            console.log('Fetch Error: ', error);
        }
    }

    const getDayPassed = (date: string) => {
        const posted_day = date?.split('T')[0];
        const lastPosted = Date.now() - new Date(posted_day).getTime();
        const dayPassed = Math.floor(lastPosted / (1000*60*60*24));
        return dayPassed;
    }

    const handleClickPreNextPage = async (pre_next: string , id: number) => {
        try {
            const totalPage = dataOrtherBlogs.totalPages;
            let pageCurrent = dataOrtherBlogs.currentPage;
            if(pre_next === 'next'){
                if(pageCurrent < totalPage){
                    await fetchOrtherBlogs(id, pageCurrent+=1);
                } else {
                    return alert('Đã đến số trang tối đa!');
                }
            }

            if(pre_next === 'pre'){
                if(pageCurrent > 1){
                    await fetchOrtherBlogs(id, pageCurrent-=1);
                } else {
                    return alert('Đã đến trang đầu tiên!');
                }
            }
        } catch (error) {
            console.log('Pre-Next Error: ', error);
        }
    }

    const handleClickLogo = () => {
        navigate('/');
        window.location.reload();
    }

    const handleClickViewBlog = (title: string, data: any) => {
        const blogPath = title.replace(/\s+/g, '-');
        navigate(`post/view-blog/${blogPath}`, { state: data});
    }

    const handleScrollToId = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return(
        <>
        <HelmetProvider>
        <Helmet>
            <style>{`
                body, html {
                    overflow-x: hidden;
                }
            `}</style>
        </Helmet>
        </HelmetProvider>
        <div className={style.wrapContainerBlogContent}>
            <header className={parent.header} id='header'>
                    <div className={parent.titleHeader} onClick={handleClickLogo}>
                        <h1>My Website</h1>
                    </div>
                <div className={parent.containerBtnSignupSignin}>
                    {/* <div className={parent.btnSignup}>
                        Đăng ký
                    </div> */}
                    <div className={parent.btnSignin}>
                        Đăng nhập
                    </div>
                </div>
            </header>
            {Array.isArray(dataBC)? 
                <div className={style.wrapContainerContentBC}>
                    <div className={style.navbarTittleBC}>
                        <Link to={'/blogs'} style={{textDecoration: 'none'}}><div className={style.pathNavbar}>Home</div></Link>
                        <Link 
                            to={blogData.tag === 'website'? '/blogs/website': '/blogs/mobile'}
                            style={{textDecoration: 'none'}}
                        >
                            <div className={style.pathNavbar}>
                                {blogData.tag.charAt(0).toUpperCase() + blogData.tag.slice(1)}
                            </div>
                        </Link>
                        <div className={style.titleBC}>
                            {blogData.title}
                        </div>
                    </div>
                    <div className={style.containerBlogOverview}>
                        <div className={style.contentBC}>
                            <div className={parent.tagBlog}>
                                <div className={parent.tag}>
                                    {blogData.tag.charAt(0).toUpperCase() + blogData.tag.slice(1)}
                                </div>
                            </div>
                            <div className={style.headerBC}>
                                {blogData.title}
                            </div>
                            <div className={style.containerTagBC}>
                                <div>{dataBC[0]?.postedBy}</div>
                                <div>{dataBC[0]?.createdAt.split('T')[0]}</div>
                            </div>
                        </div>
                        <img src={`${API_BASE_URL}/${blogData.img}`} alt="" />
                    </div>
                    <div className={style.containerContentBC}>
                        <div className={style.areaShowContentBC}>
                            {dataBC.map((items: any) => {

                                let typeContent: any, content: any, contentList: any;
                                if(items.type_content === 'text'){
                                    typeContent = style.textNormalBC;
                                    content = items.content;
                                }
                                if(items.type_content === 'heading'){
                                    typeContent = style.textHeaderBC;
                                    content = items.content;
                                }
                                if(items.type_content === 'image'){
                                    typeContent = style.imgInContentBC;
                                    content = <img src={`${API_BASE_URL}/${items.content}`} />
                                }
                                if(items.type_content === 'textul'){
                                    typeContent = style.textulBC;
                                    contentList = items.content.split(/\r?\n/).map((conts: any) => {
                                        return(
                                            <ul>
                                                <li><b>{conts.split(':')[0]}: </b>{conts.split(':')[1]}</li>
                                            </ul>
                                        )
                                    })
                                    content = undefined;
                                }
                                if(items.type_content === 'textol'){
                                    typeContent = style.textulBC;
                                    contentList = items.content.split(/\r?\n/).map((conts: any) => {
                                        return(
                                            <ol>
                                                <li><b>{conts.split(':')[0]}: </b>{conts.split(':')[1]}</li>
                                            </ol>
                                        )
                                    })
                                    content = undefined;
                                }

                                return(
                                    <div className={typeContent} id={items.id}>
                                        {content? content: contentList}
                                    </div>
                                )
                            })}
                        </div>
                        <div className={style.areaTableOfContent} style={{ position: isSticky ? 'sticky' : 'static' }}>
                            <div className={style.headerToC}>
                                <h3>Nội dung bài đăng</h3>
                                <i className="fa-solid fa-chevron-up"></i>
                            </div>
                            <div className={style.tableOfContent}>
                                {dataBC
                                .filter((items: any) => items.type_content === 'heading')
                                .map((items: any) => {
                                    return(
                                        <>
                                            <div className={style.indexToC} onClick={() => handleScrollToId(items.id)}>
                                                {items.content}
                                            </div>
                                        </>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    <div className={style.wrapContainerOrtherBlogsBC}>
                        <h3>Bài viết khác</h3>
                        <div className={style.containerOrtherBlogsBC}>
                            <i 
                                className="fa-solid fa-chevron-left"
                                onClick={() =>
                                    handleClickPreNextPage('pre', blogData.id)
                                }
                            >
                            </i>
                            <div className={`${parent.containerGroup3Blogs} ${style.containerBlogsBC}`}>
                                {dataOrtherBlogs?.blogs?.map((items: any) => {
                                    return(
                                        <div className={parent.wrapContainerAllBlog}>
                                            <img 
                                                src={`${API_BASE_URL}/${items.img}`}
                                                onClick={() =>
                                                    handleClickViewBlog(items.title, items)
                                                }
                                            />
                                            <div className={parent.containerBlog}>
                                                <div className={parent.footerBlog}>
                                                    <div className={parent.tagBlog}>
                                                        <div className={parent.tag}>Business</div>
                                                        <div>
                                                            {
                                                                getDayPassed(items.createdAt.split('T')[0]) === 0?
                                                                "Trong hôm nay":
                                                                getDayPassed(items.createdAt.split('T')[0])+" ngày trước"
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                <div 
                                                    className={parent.headerBlog}
                                                    onClick={() =>
                                                        handleClickViewBlog(items.title, items)
                                                    }
                                                >
                                                    {items.title}
                                                </div>
                                                <div className={parent.postedAt}>
                                                    Đăng ngày: {items.postedAt.split('T')[0]}.
                                                </div>
                                                <div className={parent.description}>
                                                    {items.description}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <i 
                                className="fa-solid fa-chevron-right"
                                onClick={() =>
                                    handleClickPreNextPage('next', blogData.id)
                                }
                            >
                            </i>
                        </div>
                    </div>
                </div>: 
                <div style={{height: '571px'}}>Bài đăng tạm thời chưa có nội dung</div>
            }
        </div>
        </>
    )
}

export default BlogContent;