import Divider from '@mui/material/Divider';

import WebLayout from '@/layouts/web-layout';
import Hero from '@/components/www/Hero';
import LogoCollection from '@/components/www/LogoCollection';
import Features from '@/components/www/Features';
import Testimonials from '@/components/www/Testimonials';
import Highlights from '@/components/www/Highlights';
import Pricing from '@/components/www/Pricing';
import Footer from '@/components/www/Footer';
import FAQ from '@/components/www/FAQ';
import FooterAdvanced from '@/components/www/Footer-advanced';
import FooterBasic from '@/components/www/Footer-basic';
import FooterSimple from '@/components/www/Footer-simple';

export default function index(props: { disableCustomTheme?: boolean }) {
    return (
        <WebLayout {...props}>
            <Hero />
            <div>
                <LogoCollection />
                <Features />
                <Divider />
                <Testimonials />
                <Divider />
                <Highlights />
                <Divider />
                <Pricing />
                <Divider />
                <FAQ />
                <Divider />
                {/* <FooterAdvanced/>
                <FooterBasic/>
                <FooterSimple/> */}
                <Footer />
            </div>
        </WebLayout>
    );
}
