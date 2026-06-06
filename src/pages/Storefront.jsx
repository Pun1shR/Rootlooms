import Header from '../components/Header';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import FeaturedProducts from '../components/FeaturedProducts';
import About from '../components/About';
import Footer from '../components/Footer';

const Storefront = ({ categories, sarees, loading, setIsLoginModalOpen }) => {
  return (
    <>
      <Header onLoginClick={() => setIsLoginModalOpen(true)} />
      <main>
        <Hero />
        {loading ? (
          <div className="py-4 text-center" style={{ padding: '40px 0', fontSize: '1.2rem', color: '#666' }}>
            Loading live collection...
          </div>
        ) : (
          <>
            <Categories categories={categories} sarees={sarees} />
            <FeaturedProducts categories={categories} sarees={sarees} />
            <About />
          </>
        )}
      </main>
      <Footer />
    </>
  );
};

export default Storefront;
