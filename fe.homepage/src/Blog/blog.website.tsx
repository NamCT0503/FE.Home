import { useEffect, useState } from "react";
import style from "../css.module/blogs.module.css";
import { useNavigate } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import API_ROUTER, { API_BASE_URL } from "../router/router";

// const url = 'http://localhost:5000/api/homepage/service/blog/get-blogs/tagWebsite/:page';
const url = API_ROUTER.SEARCHBLOG.replace(':search', 'tagWebsite');
// const url_getBlogOutstanding = `http://localhost:5000/api/homepage/service/blog/get-blogs/isOutstanding/:page`
const url_getBlogOutstanding = API_ROUTER.SEARCHBLOG.replace(':search', 'isOutstanding');

const BlogsWebsite = () => {
    const [data, setData] = useState<any>([]);
    const [blogOutstanding, setBlogOutstanding] = useState<any>();

    const navigate = useNavigate();

    const fetcher = async (url: string, isOutstanding: boolean) => {
        try {
            const res = await fetch(url, {
                method: "GET"
            });
            const dataRes = await res.json();
            if(!isOutstanding){
                setData([dataRes]);
            } else {
                setBlogOutstanding(dataRes)
            }
        } catch (error) {
            console.log('Fetch Error: ', error);
        }
    }

    useEffect(() => {
        fetcher(url, false);
        fetcher(url_getBlogOutstanding, true);
    }, []);

    if((!blogOutstanding || blogOutstanding.count===0) && (!data[0]?.blogs || data[0]?.blogs?.length===0)){
        return(
            <DotLottieReact
                src="https://lottie.host/8ee303ea-acde-4e78-bd39-fa92a440f34a/SIcGfi0vNv.lottie"
                loop
                autoplay
            />
        )
    }

    const recordPage = data[0]?.recordPage;
    const numberDiv = Math.ceil(recordPage / 3);

    const postedAtBlogOut = blogOutstanding?.rows[0]?.postedAt;

    const getDayPassed = (date: string) => {
        const posted_day = date?.split('T')[0];
        const lastPosted = Date.now() - new Date(posted_day).getTime();
        const dayPassed = Math.floor(lastPosted / (1000*60*60*24));
        return dayPassed;
    }

    const handleClickPreNextPage = (pre_next: string, data: any) => {
        try {
            let url = API_ROUTER.SEARCHBLOG.split(':page')[0].replace(':search', ':filter');
            const totalPage = data[0]?.totalPages;
            let pageCurrent = data[0]?.currentPage;
            if(pre_next === 'next'){
                if(pageCurrent < totalPage){
                    url = url+`${pageCurrent+=1}`;
                    fetcher(url, false);
                } else {
                    return alert('Đã đến số trang tối đa!');
                }
            }

            if(pre_next === 'pre'){
                if(pageCurrent > 1){
                    url = url+`${pageCurrent-=1}`;
                    fetcher(url, false);
                } else {
                    return alert('Đã đến trang đầu tiên!');
                }
            }
        } catch (error) {
            console.log('Pre-Next Error: ', error);
        }
    }

    const handleClickViewBlog = (title: string, data: any) => {
        const blogPath = title.replace(/\s+/g, '-');
        navigate(`../post/view-blog/${blogPath}`, { state: data});
    }

    return(
        <div className={style.wrapContainerBlogAll}>
            {
                (blogOutstanding && blogOutstanding?.count)?
                <div className={style.containerBlogOutstanding}>
                    <img 
                        src={`${API_BASE_URL}/${blogOutstanding?.rows[0].img}`} 
                        onClick={() => {
                            handleClickViewBlog(blogOutstanding?.rows[0].title, blogOutstanding?.rows[0]);
                        }}
                    />
                    <div className={style.contentOutStandingAll}>
                        <div 
                            className={style.headerOutstandingAll}
                            onClick={() => {
                                handleClickViewBlog(blogOutstanding?.rows[0].title, blogOutstanding?.rows[0]);
                            }}
                        >
                            {blogOutstanding?.rows[0].title}
                        </div>
                        <div className={style.postedAt}>
                            Đăng ngày: {postedAtBlogOut?.split('T')[0]}
                        </div>
                        <div className={style.description}>
                            {blogOutstanding?.rows[0].description}
                        </div>
                        <div className={style.footerBlog}>
                            <div className={style.tagBlog}>
                                <div className={style.tag}>
                                    {blogOutstanding?.rows[0].tag}
                                </div>
                                <div>{getDayPassed(postedAtBlogOut) === 0? "Trong hôm nay": getDayPassed(postedAtBlogOut)+" ngày trước."}</div>
                            </div>
                        </div>
                    </div>
                </div>: <></>
            }
            <div className={style.containerAllBlogs}>
                {Array.from({length: numberDiv}, (_, index) => (
                    <div className={style.containerGroup3Blogs}>
                        {data[0]?.blogs.slice(index * 3, index * 3 + 3)
                            .map((items: any) => {
                                const dayPassed = getDayPassed(items?.postedAt);
                            return(
                                <div className={style.wrapContainerAllBlog}>
                                    <img 
                                        src={`${API_BASE_URL}/${items.img}`} alt=""
                                        onClick={() => 
                                            handleClickViewBlog(items.title, items)
                                        }
                                    />
                                    <div className={style.containerBlog}>
                                        <div className={style.footerBlog}>
                                            <div className={style.tagBlog}>
                                                <div className={style.tag}>{items.tag}</div>
                                                <div>
                                                    {
                                                        dayPassed === 0?
                                                        "Trong hôm nay": 
                                                        dayPassed+" ngày trước"
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div 
                                            className={style.headerBlog}
                                            onClick={() => 
                                                handleClickViewBlog(items.title, items)
                                            }
                                        >
                                            {items?.title}
                                        </div>
                                        <div className={style.postedAt}>
                                            Đăng ngày: {items?.postedAt.split('T')[0]}.
                                        </div>
                                        <div className={`${style.description} ${style.allBlogs}`}>
                                            {items?.description}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ))}
            </div>
            <div className={style.containerPrevNext}>
                <i 
                    className="fa-solid fa-chevron-left"
                    onClick={() => handleClickPreNextPage('pre', data)}    
                ></i>
                <div className={style.pageCurrent}>
                    {data[0]?.currentPage}
                </div>
                <i 
                    className="fa-solid fa-chevron-right"
                    onClick={() => handleClickPreNextPage('next', data)}    
                ></i>
            </div>
        </div>
    )
}

export default BlogsWebsite;