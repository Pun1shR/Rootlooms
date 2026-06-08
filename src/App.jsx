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

        const cats = categoriesResponse.data || [];
        setCategories(cats);

        let fetchedSarees = sareesResponse.data || [];
        if (cats.length > 0) {
          fetchedSarees = [
            {
              id: 'test-razorpay-item-1',
              name: 'Razorpay Test Item (₹1)',
              price: 1,
              stock: 999,
              category_id: cats[0].id,
              image_url: 'https://placehold.co/400x500/eaeaea/5a4738?text=Razorpay+Test+₹1',
              isTest: true,
              created_at: new Date().toISOString()
            },
            ...fetchedSarees
          ];
        }
        setSarees(fetchedSarees);
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
          supabase.from('sarees').select('*').order('created_at', { ascending: false })
            .then(res => {
              if (res.data) {
                let fetchedSarees = res.data;
                setCategories(currentCats => {
                  if (currentCats.length > 0) {
                    setSarees([
                      {
                        id: 'test-razorpay-item-1',
                        name: 'Razorpay Test Item (₹1)',
                        price: 1,
                        stock: 999,
                        category_id: currentCats[0].id,
                        image_url: 'https://placehold.co/400x500/eaeaea/5a4738?text=Razorpay+Test+₹1',
                        isTest: true,
                        created_at: new Date().toISOString()
                      },
                      ...fetchedSarees
                    ]);
                  } else {
                    setSarees(fetchedSarees);
                  }
                  return currentCats;
                });
              }
            });
        })
        .subscribe();

      const catChannel = supabase
        .channel('public:categories')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, () => {
           supabase.from('categories').select('*').order('name')
            .then(res => {
              if (res.data) {
                setCategories(res.data);
                supabase.from('sarees').select('*').order('created_at', { ascending: false })
                  .then(sareeRes => {
                    if (sareeRes.data) {
                      const cats = res.data;
                      if (cats.length > 0) {
                        setSarees([
                          {
                            id: 'test-razorpay-item-1',
                            name: 'Razorpay Test Item (₹1)',
                            price: 1,
                            stock: 999,
                            category_id: cats[0].id,
                            image_url: 'https://placehold.co/400x500/eaeaea/5a4738?text=Razorpay+Test+₹1',
                            isTest: true,
                            created_at: new Date().toISOString()
                          },
                          ...sareeRes.data
                        ]);
                      } else {
                        setSarees(sareeRes.data);
                      }
                    }
                  });
              }
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
