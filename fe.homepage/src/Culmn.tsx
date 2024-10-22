import TestSection from "./TestSection";
import FeaturedSection from "./FeaturedSection";
import HomeNav from "./HomeNav";
import HomeSection from "./HomeSection";
import ProductionSection from "./ProductionSection";
import ActionSection from "./ActionSection";
import Footer from "./Footer";

const Culmn = () => {
    return(
        <div className="culmn">
            <HomeNav></HomeNav>
            <HomeSection></HomeSection>
            <FeaturedSection></FeaturedSection>
            <ProductionSection></ProductionSection>
            <TestSection></TestSection>
            <ActionSection></ActionSection>
            <Footer></Footer>
        </div>
    )
}

export default Culmn;