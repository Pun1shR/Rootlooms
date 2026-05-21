const Categories = ({ categories, sarees }) => {
  const scrollToCategory = (categoryId) => {
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      // Offset by roughly header height (if fixed) or just smooth scroll
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="categories-section" className="py-4">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Shop by Category</h2>
        </div>
        
        {categories.length === 0 ? (
          <div className="text-center" style={{ padding: '20px', color: '#888' }}>
            No categories available yet. Upload via Telegram!
          </div>
        ) : (
          <div className="categories-grid">
            {categories.map(cat => {
              // Find the first saree for this category to use as the thumbnail
              const firstSaree = sarees.find(s => s.category_id === cat.id);
              const image = firstSaree ? firstSaree.image_url : 'https://placehold.co/400x500/eaeaea/a0a0a0?text=Empty';

              return (
                <div 
                  key={cat.id} 
                  className="category-card" 
                  onClick={() => scrollToCategory(cat.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <img src={image} alt={cat.name} className="category-image" />
                  <div className="category-overlay">
                    <h3 className="category-title">{cat.name}</h3>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Categories;
