const FeaturedProducts = () => {
  const products = [
    { id: 1, name: 'Maheshwari Cotton Saree', price: '₹ Price', image: '/saree/IMG_0822.jpg' },
    { id: 2, name: 'Matka Lenin Classic', price: '₹ Price', image: '/saree/IMG_0823.jpg' },
    { id: 3, name: 'Paithani Lenin Elegance', price: '₹ Price', image: '/saree/IMG_0824.jpg' },
    { id: 4, name: 'Ajrak Modal Silk Saree', price: '₹ Price', image: '/saree/IMG_0825.jpg' },
  ];

  return (
    <section className="py-4 bg-surface">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Featured Collection</h2>
        </div>
        <div className="products-grid">
          {products.map(prod => (
            <div key={prod.id} className="product-card">
              <div className="product-image-container">
                <img src={prod.image} alt={prod.name} className="product-image" />
              </div>
              <h4 className="product-title">{prod.name}</h4>
              <p className="product-price">{prod.price}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-4">
          <button className="btn btn-outline">View All Products</button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
