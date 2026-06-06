import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import LoginModal from './components/LoginModal';
import CartDrawer from './components/CartDrawer';
import Storefront from './pages/Storefront';
import AdminPanel from './pages/AdminPanel';
import { supabase } from './supabaseClient';
import './App.css';

function App() {
  const [categories, setCategories] = useState([]);
  const [sarees, setSarees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!supabase) {
        console.error("Supabase is not initialized.");
        setLoading(false);
        return;
      }
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
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    // Set up Realtime Sync for Sarees
    if (supabase) {
      const channel = supabase
        .channel('public:sarees')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'sarees' }, (payload) => {
          // Re-fetch sarees when any change occurs to ensure perfect sync
          // We could mutate state directly, but re-fetching is safer and simpler for small catalogs
          supabase.from('sarees').select('*').order('created_at', { ascending: false })
            .then(res => {
              if (res.data) setSarees(res.data);
            });
        })
        .subscribe();

      const catChannel = supabase
        .channel('public:categories')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, () => {
           supabase.from('categories').select('*').order('name')
            .then(res => {
              if (res.data) setCategories(res.data);
            });
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
        supabase.removeChannel(catChannel);
      };
    }
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="app-container">
            {!supabase && (
              <div style={{
                backgroundColor: '#ffebee', color: '#c62828', padding: '12px 20px', textAlign: 'center',
                fontSize: '0.9rem', fontWeight: '600', position: 'sticky', top: 0, zIndex: 9999
              }}>
                ⚠️ <strong>Supabase Keys Missing</strong>
              </div>
            )}
            
            <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
            <CartDrawer onLoginClick={() => setIsLoginModalOpen(true)} />
            
            <Routes>
              <Route path="/" element={
                <Storefront 
                  categories={categories} 
                  sarees={sarees} 
                  loading={loading} 
                  setIsLoginModalOpen={setIsLoginModalOpen} 
                />
              } />
              <Route path="/admin" element={<AdminPanel categories={categories} sarees={sarees} />} />
            </Routes>
            
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
