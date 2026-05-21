const FeaturedProducts = ({ categories, sarees }) => {
  return (
    <div className="bg-surface" style={{ backgroundColor: 'var(--color-surface)' }}>
      {categories.map(cat => {
        // Get all sarees for this category
        const categorySarees = sarees.filter(s => s.category_id === cat.id);
        
        // We need exactly 5 cards minimum. If we have less, we pad with dummy cards.
        const paddedSarees = [...categorySarees];
        while (paddedSarees.length < 5) {
          paddedSarees.push({
            id: `dummy-${cat.id}-${paddedSarees.length}`,
            isDummy: true,
            name: 'Sold Out',
            price: '-',
            image_url: 'https://placehold.co/400x500/eaeaea/a0a0a0?text=Sold+Out'
          });
        }

        return (
          <section key={cat.id} id={`category-${cat.id}`} className="py-4" style={{ borderTop: '1px solid #e7e0d7', position: 'relative' }}>
            <div className="container">
              <div className="section-header" style={{ marginBottom: '2rem' }}>
                <h2 className="section-title">{cat.name} Collection</h2>
              </div>
              
              {/* Horizontal scroll container with right fade */}
              <div style={{ position: 'relative', width: '100%' }}>
                <div 
                  className="products-scroll-container" 
                  style={{
                    display: 'flex',
                    overflowX: 'auto',
                    gap: '1.5rem',
                    paddingBottom: '1.5rem',
                    paddingRight: '60px', /* Allow room to scroll past the last item before the fade */
                    scrollBehavior: 'smooth',
                    msOverflowStyle: 'none',  /* IE/Edge */
                    scrollbarWidth: 'none'    /* Firefox */
                  }}
                >
                  {paddedSarees.map(prod => (
                    <div 
                      key={prod.id} 
                      className="product-card"
                      style={{ 
                        flex: '0 0 180px', /* Ensure it stays exactly 180px wide and doesn't shrink */
                        textAlign: 'left',  /* Left-align text for elegant mobile catalog feel */
                        filter: prod.isDummy ? 'grayscale(100%) opacity(70%)' : 'none'
                      }}
                    >
                      <div className="product-image-container" style={{ position: 'relative', marginBottom: '0.8rem' }}>
                        <img src={prod.image_url} alt={prod.name} className="product-image" />
                        {prod.isDummy && (
                          <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            backgroundColor: 'rgba(0,0,0,0.6)',
                            color: 'white',
                            padding: '6px 12px',
                            fontWeight: 'bold',
                            fontSize: '0.8rem',
                            border: '1px solid white',
                            letterSpacing: '1px',
                            zIndex: 10,
                            whiteSpace: 'nowrap'
                          }}>
                            SOLD OUT
                          </div>
                        )}
                      </div>
                      <h4 className="product-title" style={{ fontSize: '0.95rem', margin: '0 0 0.3rem 0', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {prod.name}
                      </h4>
                      <p className="product-price" style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-light)' }}>
                        {prod.price !== '-' ? `₹ ${new Intl.NumberFormat('en-IN').format(Number(prod.price))}` : '-'}
                      </p>
                    </div>
                  ))}
                </div>
                
                {/* Horizontal scroll right-side fade indicator blending with surface background */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  right: -10,
                  bottom: '1.5rem', /* Align with container bottom, excluding scrollbar padding */
                  width: '80px',
                  background: 'linear-gradient(to right, rgba(243, 236, 227, 0) 0%, var(--color-surface) 100%)',
                  pointerEvents: 'none',
                  zIndex: 2
                }} />
              </div>
            </div>
          </section>
        );
      })}

      {categories.length === 0 && (
        <div className="py-4 text-center" style={{ color: '#888' }}>
          No products available yet. Send a photo to the Telegram bot to get started!
        </div>
      )}
    </div>
  );
};

export default FeaturedProducts;
