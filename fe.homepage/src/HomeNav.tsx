import { useNavigate } from "react-router-dom";
import "../public/lib/assets/js/bootsnav"; 

const HomeNav = () => {
    const navigate = useNavigate();

    const handleClickNav = () => {
        navigate('/blogs');
    }
    return(
        <nav className="navbar navbar-default bootsnav navbar-fixed">
                <div className="navbar-top bg-grey fix">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="navbar-callus text-left sm-text-center">
                                    <ul className="list-inline">
                                        <li><a href=""><i className="fa fa-phone"></i> Liên hệ: 1234 5678 90</a></li>
                                        <li><a href=""><i className="fa fa-envelope-o"></i> Email: mywebsite@email.com</a></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="navbar-socail text-right sm-text-center">
                                    <ul className="list-inline">
                                        <li><a href=""><i className="fa fa-facebook"></i></a></li>
                                        <li><a href=""><i className="fa fa-twitter"></i></a></li>
                                        <li><a href=""><i className="fa fa-linkedin"></i></a></li>
                                        <li><a href=""><i className="fa fa-google-plus"></i></a></li>
                                        <li><a href=""><i className="fa fa-behance"></i></a></li>
                                        <li><a href=""><i className="fa fa-dribbble"></i></a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container"> 
                    {/* <!-- Start Header Navigation --> */}
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#navbar-menu">
                            <i className="fa fa-bars"></i>
                        </button>
                        <a className="navbar-brand" href="#brand">
                            <img src="/lib/assets/images/logo.png" className="logo" alt="" />
                            {/* <!--<img src="assets/images/footer-logo.png" className="logo logo-scrolled" alt="">--> */}
                        </a>

                    </div>
                    {/* <!-- End Header Navigation --> */}

                    {/* <!-- navbar menu --> */}
                    <div className="collapse navbar-collapse" id="navbar-menu">
                        <ul className="nav navbar-nav navbar-right">
                            <li><a href="#home">Trang chủ</a></li>                    
                            <li><a href="#product">Sản phẩm</a></li>
                            <li><a href="#e-service">Dịch vụ</a></li>
                            <li><a href="#contact">Liên hệ</a></li>
                            <li onClick={handleClickNav}><a href="">Bài đăng</a></li>
                        </ul>
                    </div>
                    {/* <!-- /.navbar-collapse --> */}
                </div> 

            </nav>
    )
}

export default HomeNav;