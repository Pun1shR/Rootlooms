import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Categories from './components/Categories';
import FeaturedProducts from './components/FeaturedProducts';
import About from './components/About';
import Footer from './components/Footer';
import { supabase } from './supabaseClient';
import './App.css';

function App() {
  const [categories, setCategories] = useState([]);
  const [sarees, setSarees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [categoriesResponse, sareesResponse] = await Promise.all([
          supabase.from('categories').select('*').order('name'),
          supabase.from('sarees').select('*').order('created_at', { ascending: false })
        ]);

        if (categoriesResponse.error) throw categoriesResponse.error;
        if (sareesResponse.error) throw sareesResponse.error;

        setCategories(categoriesResponse.data || []);
        setSarees(sareesResponse.data || []);
      } catch (error) {
        console.error("Error fetching data from Supabase:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="app-container">
      <Header />
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
    </div>
  );
}

export default App;
