import { useEffect } from "react";
import $ from "jquery";
import "../public/lib/assets/js/bootsnav"; 

const HomeNav = () => {
    useEffect(() => {
        $("nav.navbar.bootsnav .attr-nav").each(function(){  
            $("li.search > a", this).on("click", function(e){
                e.preventDefault();
                $(".top-search").slideToggle();
            });
        });
        $(".input-group-addon.close-search").on("click", function(){
            $(".top-search").slideUp();
        });

        if (window.bootsnav) {
            window.bootsnav.initialize();
        }

        $(document).ready(function(){
            window.bootsnav.initialize();
        });
        $(window).on("resize", function(){   
            window.bootsnav.hoverDropdown();
            
            $(".top-search").slideUp();
            setTimeout(function(){
                window.bootsnav.navbarSticky();
            }, 500);
            
            // Toggle Bars
            $(".navbar-toggle").each(function(){
                $(".fa", this).removeClass("fa-times");
                $(".fa", this).addClass("fa-bars");
                $(this).removeClass("fixed");
            });        
            $(".navbar-collapse").removeClass("in");
            $(".navbar-collapse").removeClass("on");
            $(".navbar-collapse").removeClass("bounceIn");      
        });

        return () => {
            $(window).off("resize");
        };
    }, [])

    return(
        <nav className="navbar navbar-default bootsnav navbar-fixed">
                <div className="navbar-top bg-grey fix">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="navbar-callus text-left sm-text-center">
                                    <ul className="list-inline">
                                        <li><a href=""><i className="fa fa-phone"></i> Call us: 1234 5678 90</a></li>
                                        <li><a href=""><i className="fa fa-envelope-o"></i> Contact us: your@email.com</a></li>
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

                {/* <!-- Start Top Search --> */}
                <div className="top-search">
                    <div className="container">
                        <div className="input-group">
                            <span className="input-group-addon"><i className="fa fa-search"></i></span>
                            <input type="text" className="form-control" placeholder="Search" />
                            <span className="input-group-addon close-search"><i className="fa fa-times"></i></span>
                        </div>
                    </div>
                </div>
                {/* <!-- End Top Search --> */}


                <div className="container"> 
                    <div className="attr-nav">
                        <ul>
                            <li className="search"><a href="#"><i className="fa fa-search"></i></a></li>
                        </ul>
                    </div> 

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
                            <li><a href="#home">Home</a></li>                    
                            <li><a href="#features">About</a></li>
                            <li><a href="#business">Service</a></li>
                            <li><a href="#work">Portfolio</a></li>
                            <li><a href="#test">Blog</a></li>
                            <li><a href="#contact">Contact</a></li>
                        </ul>
                    </div>
                    {/* <!-- /.navbar-collapse --> */}
                </div> 

            </nav>
    )
}

export default HomeNav;