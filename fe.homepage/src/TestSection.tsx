const TestSection = () => {
    return(
        <section id="test" className="test bg-grey roomy-60 fix">
            <div className="container">
                <div className="row">                        
                    <div className="main_test fix">

                        <div className="col-md-12 col-sm-12 col-xs-12">
                            <div className="head_title text-center fix">
                                <h2 className="text-uppercase">What Client Say</h2>
                                <h5>Clean and Modern design is our best specialist</h5>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="test_item fix">
                                <div className="item_img">
                                    <img className="img-circle" src="/lib/assets/images/test-img1.jpg" alt="" />
                                    <i className="fa fa-quote-left"></i>
                                </div>

                                <div className="item_text">
                                    <h5>Sarah Smith</h5>
                                    <h6>envato.com</h6>

                                    <p>Natus voluptatum enim quod necessitatibus quis
                                        expedita harum provident eos obcaecati id culpa
                                        corporis molestias.</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="test_item fix sm-m-top-30">
                                <div className="item_img">
                                    <img className="img-circle" src="/lib/assets/images/test-img2.jpg" alt="" />
                                    <i className="fa fa-quote-left"></i>
                                </div>

                                <div className="item_text">
                                    <h5>Sarah Smith</h5>
                                    <h6>envato.com</h6>

                                    <p>Natus voluptatum enim quod necessitatibus quis
                                        expedita harum provident eos obcaecati id culpa
                                        corporis molestias.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default TestSection;