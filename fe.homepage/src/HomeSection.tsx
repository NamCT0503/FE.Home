import $ from 'jquery';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel';
import { useEffect } from 'react';

const HomeSection = () => {
    useEffect(() => {
        $(".hello_slid").slick({
          dots: true,
          infinite: false,
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: true,
          prevArrow: "<i class='icon icon-chevron-left nextprevleft'></i>",
          nextArrow: "<i class='icon icon-chevron-right nextprevright'></i>",
          autoplay: true,
          autoplaySpeed: 2000
        });

        return () => {
            $(".hello_slid").slick('unslick');
        };
    }, [])

    return(
        <section id="home" className="home bg-black fix">
            <div className="overlay"></div>
            <div className="container">
                <div className="row">
                    <div className="main_home text-center">
                        <div className="col-md-12">
                        <div className="hello_slid">
                            <div className="slid_item">
                                <div className="home_text ">
                                    <h2 className="text-white">Welcome to <strong>Made</strong></h2>
                                    <h1 className="text-white">We Do Business All Of Time</h1>
                                    <h3 className="text-white">- We Create a <strong>Concept</strong> into The Market -</h3>
                                </div>

                                <div className="home_btns m-top-40">
                                    <a href="" className="btn btn-primary m-top-20">Buy Now</a>
                                    <a href="" className="btn btn-default m-top-20">Take a Tour</a>
                                </div>
                            </div>
                            {/* <!-- End off slid item --> */}
                            <div className="slid_item">
                                <div className="home_text ">
                                    <h2 className="text-white">Welcome to <strong>Made</strong></h2>
                                    <h1 className="text-white">We Do Business All Of Time</h1>
                                    <h3 className="text-white">- We Create a <strong>Concept</strong> into The Market -</h3>
                                </div>

                                <div className="home_btns m-top-40">
                                    <a href="" className="btn btn-primary m-top-20">Buy Now</a>
                                    <a href="" className="btn btn-default m-top-20">Take a Tour</a>
                                </div>
                            </div>
                            {/* <!-- End off slid item --> */}
                            <div className="slid_item">
                                <div className="home_text ">
                                    <h2 className="text-white">Welcome to <strong>Made</strong></h2>
                                    <h1 className="text-white">We Do Business All Of Time</h1>
                                    <h3 className="text-white">- We Create a <strong>Concept</strong> into The Market -</h3>
                                </div>

                                <div className="home_btns m-top-40">
                                    <a href="" className="btn btn-primary m-top-20">Buy Now</a>
                                    <a href="" className="btn btn-default m-top-20">Take a Tour</a>
                                </div>
                            </div>
                            {/* <!-- End off slid item --> */}
                        </div>
                        </div>
                    </div>
                </div>
                {/* <!--End off row--> */}
            </div>
            {/* <!--End off container --> */}
        </section>
    )
}

export default HomeSection;
