const Categories = () => {
  const categories = [
    { id: 1, title: 'Maheshwari Cotton', image: '/saree/IMG_0816.jpg' },
    { id: 2, title: 'Maheshwari Silk', image: '/saree/IMG_0817.jpg' },
    { id: 3, title: 'Ilkal Cotton', image: '/saree/IMG_0818.jpg' },
    { id: 4, title: 'Matka Lenin', image: '/saree/IMG_0819.jpg' },
    { id: 5, title: 'Paithani Lenin', image: '/saree/IMG_0820.jpg' },
    { id: 6, title: 'Ajrak Modal Silk', image: '/saree/IMG_0821.jpg' }
  ];

  return (
    <section className="py-4">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Shop by Category</h2>
        </div>
        <div className="categories-grid">
          {categories.map(cat => (
            <div key={cat.id} className="category-card">
              <img src={cat.image} alt={cat.title} className="category-image" />
              <div className="category-overlay">
                <h3 className="category-title">{cat.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
