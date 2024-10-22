const FeaturedSection = () => {
    return(
        <section id="features" className="features">
            <div className="container">
                <div className="row">
                    <div className="main_features fix roomy-70">
                        <div className="col-md-4">
                            <div className="features_item sm-m-top-30">
                                <div className="f_item_icon">
                                    <i className="fa fa-thumbs-o-up"></i>
                                </div>
                                <div className="f_item_text">
                                    <h3>Best Quality Design</h3>
                                    <p>Lorem ipsum dolor sit amet consectetur adipiscing elit pellentesque eleifend
                                        in sit amet mattis volutpat rhoncus.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="features_item sm-m-top-30">
                                <div className="f_item_icon">
                                    <i className="fa fa-tablet"></i>
                                </div>
                                <div className="f_item_text">
                                    <h3>Responsive Design</h3>
                                    <p>Lorem ipsum dolor sit amet consectetur adipiscing elit pellentesque eleifend
                                        in sit amet mattis volutpat rhoncus.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="features_item sm-m-top-30">
                                <div className="f_item_icon">
                                    <i className="fa fa-sliders"></i>
                                </div>
                                <div className="f_item_text">
                                    <h3>Easy to Customize</h3>
                                    <p>Lorem ipsum dolor sit amet consectetur adipiscing elit pellentesque eleifend
                                        in sit amet mattis volutpat rhoncus.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- End off row --> */}
            </div>
            {/* <!-- End off container --> */}
        </section>  
    )
}

export default FeaturedSection;