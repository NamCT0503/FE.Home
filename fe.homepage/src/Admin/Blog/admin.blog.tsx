import serOverview from "../../css.module/admin/service.web.module.css";
import serPackage from "../../css.module/admin/service.package.module.css";
import style from "../../css.module/admin/blog.managenment.module.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_ROUTER from "../../router/router";
import BlogListView from "./blog.listview";

const AdminBlogs = () => {
    const [dataBlogOutstanding, setDataBlogOutstanding] = useState<any>([]);
    const [dataBlogs, setDataBlogs] = useState<any>([]);
    const [blogs, setBlogs] = useState<any>([]);

    // const url_getAllBlog = 'http://localhost:5000/api/homepage/service/blog/get-blogs/';
    const url_getAllBlog = API_ROUTER.GET_BLOGRANDOM.split('isRandom/:page')[0];
    const navigate = useNavigate();

    useEffect(() => {
        fetchData(url_getAllBlog+':filter/:page', false);
        fetchData(url_getAllBlog+'isOutstanding/:page', true);
    }, []);
    

    const fetchData = async (url: string, isOutstanding: boolean) => {
        try {
            if(isOutstanding){
                const resOutstanding = await fetch(url, {
                    method: "GET"
                });
                const resOutData = await resOutstanding.json();
                setDataBlogOutstanding(resOutData.rows);
            } else {
                const res = await fetch(url, {
                    method: "GET"
                });
                const resData = await res.json();
                setBlogs({
                    totalItems: resData.totalItems,
                    totalPages: resData.totalPages,
                    currentPage: resData.currentPage,
                    recordPage: resData.recordPage
                })
                setDataBlogs(resData.blogs);
            }
        } catch (error) {
            console.log('Fetch Error: ', error);
        }
    }

    const handleClickBtnCreate = () => navigate('content');

    const hanldeClickNextPage = () => {
        if(blogs.currentPage >= blogs.totalPages) return alert('Đã đến trang cuối cùng!');
        const url = url_getAllBlog+`:filter/${blogs.currentPage+=1}`;
        fetchData(url, false);
    }

    const hanldeClickPrevPage = () => {
        if(blogs.currentPage <= 1) return alert('Đã đến trang đầu tiên!');
        const url = url_getAllBlog+`:filter/${blogs.currentPage-=1}`;
        fetchData(url, false);
    }

    const hanldeClickEndPage = () => {
        if(blogs.currentPage >= blogs.totalPages) return alert('Đã đến trang cuối cùng!');
        const url = url_getAllBlog+`:filter/${blogs.totalPages}`;
        fetchData(url, false);
    }

    const hanldeClickHomePage = () => {
        if(blogs.currentPage <= 1) return alert('Đã đến trang đầu tiên!');
        const url = url_getAllBlog+`:filter/1`;
        fetchData(url, false);
    }

    return(
        <div className={serOverview.wrapContainerLayoutMain}>
            <div className={serOverview.wrapContainerTitlePage}>
                <div className={serOverview.leftContentTitlePage}>
                    <div className={serOverview.iconTitlePage}>
                        <i className="fa-solid fa-blog"></i>
                    </div>
                    <div className={serOverview.contentTitlePage}>
                        <span className={serOverview.titlePage}>Bài đăng</span>
                        <span>Trang quản lý bài đăng</span>
                    </div>
                </div>
                <div className={serOverview.rightContentTitlePage}>
                    <i className="fa-solid fa-blog"></i>
                    <span>Bài đăng</span>
                </div>
            </div>
            <div className={`${serPackage.areaCreate} ${style.createBlog}`}>
                <button 
                    className={style.btnCreate}
                    onClick={handleClickBtnCreate}
                >
                    <i className="fa-solid fa-plus"></i>
                </button>
            </div>
            <div className={`${style.wrapContainerLayoutContent} ${serOverview.blogListView}`}>
                {<BlogListView data={(dataBlogs && dataBlogOutstanding)? [...dataBlogOutstanding, ...dataBlogs]: []}></BlogListView>}
                <div className={style.wrapContainerNavigation}>
                    <i 
                        className="fa-solid fa-backward"
                        onClick={hanldeClickHomePage}
                    >
                    </i>
                    <i 
                        className="fa-solid fa-caret-left"
                        onClick={hanldeClickPrevPage}
                    >
                    </i>
                    <div className={style.pageCurrnent}>
                        <span>{blogs?.currentPage} / {blogs?.totalPages}</span>
                    </div>
                    <i 
                        className="fa-solid fa-caret-right"
                        onClick={hanldeClickNextPage}
                    >
                    </i>
                    <i 
                        className="fa-solid fa-forward"
                        onClick={hanldeClickEndPage}
                    >
                    </i> 
                </div>
            </div>
        </div>
    )
}

export default AdminBlogs;