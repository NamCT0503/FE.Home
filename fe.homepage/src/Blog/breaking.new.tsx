import React, { useEffect, useState } from 'react';
import style from "../css.module/blogs.module.css";
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import API_ROUTER from '../router/router';
import BlogAll from '../Blog/blog.all';
import BlogsWebsite from './blog.website';
import BlogsMobile from './blog.mobile';

export let dataSearchBlogs: any;
// const url = 'http://localhost:5000/api/homepage/service/blog/get-blogs/isRandom/:page';
const url = API_ROUTER.GET_BLOGRANDOM;

const BreakingNews: React.FC = () => {
    const [bgColorBlogAll, setBgColorBlogAll] = useState('#C60000');
    const [bgColorBlogWeb, setBgColorBlogWeb] = useState('white');
    const [bgColorBlogApp, setBgColorBlogApp] = useState('white');
    const [colorBlogAll, setColorBlogAll] = useState('white');
    const [colorBlogWeb, setColorBlogWeb] = useState('black');
    const [colorBlogApp, setColorBlogApp] = useState('black');
    const [dataRecommend, setDataRecommend] = useState<any>([]);
    const [dataSearch, setDataSearch] = useState<any>([]);
    const [search, setSearch] = useState('');

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        dataSearchBlogs = dataSearch;
        <BlogAll blogs={[dataSearch]}/>
    }, [dataSearch]) 

    useEffect(() => {
        const fetcher = async (url: string) => {
            try {
                const res = await fetch(url, {
                    method: "GET"
                });
    
                const data = await res.json();
                setDataRecommend(data);
            } catch (error) {
                console.log('Fetch Error: ', error);
            }
        }

        fetcher(url);
    }, [])

    useEffect(() => {
        blogsCurrent();
    }, [location.pathname]);

    const blogsCurrent = () => {
        if(location.pathname === '/blogs'){
            setBgColorBlogAll('#C60000');
            setBgColorBlogWeb('white');
            setBgColorBlogApp('white');
            setColorBlogAll('white');
            setColorBlogWeb('black');
            setColorBlogApp('black');
        } else if(location.pathname === '/blogs/website'){
            setBgColorBlogAll('white');
            setBgColorBlogWeb('#C60000');
            setBgColorBlogApp('white');
            setColorBlogAll('black');
            setColorBlogWeb('white');
            setColorBlogApp('black');
        } else if(location.pathname === '/blogs/mobile'){
            setBgColorBlogAll('white');
            setBgColorBlogWeb('white');
            setBgColorBlogApp('#C60000');
            setColorBlogAll('black');
            setColorBlogWeb('black');
            setColorBlogApp('white');
        }
    }

    const dataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        setSearch(e.target.value)
    }

    const handleSearch = async (search: string) => {
        // const url = `http://localhost:5000/api/homepage/service/blog/get-blogs/${search}/:page`;
        const url = API_ROUTER.SEARCHBLOG.replace(':search', search);
        try {
            const res = await fetch(url, {
                method: "GET"
            });

            const data = await res.json();
            setDataSearch(data);
        } catch (error) {
            console.log('Fetch Error: ', error);
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

    const handleClickAuth = (destination: string) => {
        if(destination === 'signin') navigate('../auth/signin');
        else navigate('../auth/signup')
    }

    return (
        <>
        <Helmet>
            <style>{`
                body, html {
                    overflow-x: hidden;
                }
            `}</style>
        </Helmet>
        <section id='section-news' className={style.section}>
            <header className={style.header} id='header'>
                    <div className={style.titleHeader} onClick={handleClickLogo}>
                        <h1>My Website</h1>
                    </div>
                <div className={style.containerBtnSignupSignin}>
                    <div className={style.btnSignin} onClick={() => handleClickAuth('signin')}>
                        Đăng nhập
                    </div>
                </div>
            </header>
            <div className={style.wrapMenubarBlogs}>
                <nav className={style.menubar}>
                    <ul>
                        <Link 
                            to={'/blogs'} 
                            style={{
                                textDecoration: 'none',
                                backgroundColor: bgColorBlogAll,
                                color: colorBlogAll
                            }}
                            onClick={() => {
                                setDataSearch(undefined);
                            }}
                        >
                            All
                        </Link>
                        <Link 
                            to={'website'} 
                            style={{
                                textDecoration: 'none',
                                backgroundColor: bgColorBlogWeb,
                                color: colorBlogWeb
                            }}
                        >
                            Website
                        </Link>
                        <Link 
                            to={'mobile'} 
                            style={{
                                textDecoration: 'none',
                                backgroundColor: bgColorBlogApp,
                                color: colorBlogApp
                            }}
                        >
                            Mobile
                        </Link>
                    </ul>
                </nav>
                <div className={style.containerSearch}>
                    <div className={style.inputSearch}>
                        <input 
                            type="text" 
                            id="search" 
                            placeholder='search'
                            onChange={dataChange}
                         />
                    </div>
                    <div 
                        className={style.btnSearch}
                        onClick={() => handleSearch(search)}
                    >
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </div>
                </div>
            </div>
            <div className={style.wrapContainerContentBlogs}>
                <div className={style.wrapContainerBlogs}>
                    <Routes>
                        <Route path='/' element={<BlogAll blogs={[dataSearch]}></BlogAll>}></Route>
                        <Route path='/website' element={<BlogsWebsite></BlogsWebsite>}></Route>
                        <Route path='/mobile' element={<BlogsMobile></BlogsMobile>}></Route>
                    </Routes>
                </div>
                <div className={style.wrapContainerRelatedBlogs}>
                    <div className={style.titleContainerRealted}>
                        <h3>Có thể bạn quan tâm</h3>
                    </div>
                    <div className={style.containerContentRelatedBlog}>
                        {dataRecommend?.map((items: any) => {
                            return(
                                <div className="wrapBlogsRelated">
                                    <div className={style.areaHeaderBlogRelated}>
                                        <div>{items.tag}</div>
                                        <div>{items.postedAt?.split('T')[0]}</div>
                                    </div>
                                    <div 
                                        className={style.areaContentBlogRelated}
                                        onClick={() => 
                                            handleClickViewBlog(items.title, items)
                                        }
                                    >
                                        <div>{items.title}</div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            <div className={style.blogsPagination}>
                <img src="/blogs-pagination.svg" alt="" />
            </div>
        </section>
        </>
    );
};

export default BreakingNews;
