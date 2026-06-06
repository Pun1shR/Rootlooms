import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './CartDrawer.css';

const CartDrawer = ({ onLoginClick }) => {
  const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, subtotal, shippingCost, total } = useCart();
  const { user } = useAuth();

  if (!isCartOpen) return null;

  const handleCheckout = async () => {
    if (!user) {
      setIsCartOpen(false);
      onLoginClick();
      return;
    }
    
    try {
      // 1. Create order on backend
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total })
      });
      
      const order = await res.json();
      if (order.error) throw new Error(order.error);

      // 2. Open Razorpay Popup
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || '', // Safe to expose public key
        amount: order.amount,
        currency: order.currency,
        name: 'Rootlooms',
        description: 'Premium Saree Collection',
        order_id: order.id,
        handler: async function (response) {
          // 3. Verify Payment & Save to DB
          try {
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderDetails: {
                  user_id: user.id,
                  amount: total,
                  shipping_cost: shippingCost,
                  items: cartItems.map(item => ({ id: item.id, name: item.name, price: item.price, quantity: item.quantity })),
                  shipping_address: 'TBD - Handled Post Order'
                }
              })
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              alert('Payment Successful! Your order has been placed.');
              clearCart();
              setIsCartOpen(false);
            } else {
              alert('Payment verification failed. Please contact support.');
            }
          } catch (e) {
            console.error('Verification Error:', e);
            alert('Payment verification failed.');
          }
        },
        prefill: {
          email: user.email,
        },
        theme: {
          color: '#5A4738'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        alert('Payment Failed: ' + response.error.description);
      });
      rzp.open();

    } catch (error) {
      console.error('Checkout Error:', error);
      alert('Checkout Error: ' + (error.message || 'Unknown error occurred'));
    }
  };

  return (
    <div className="cart-drawer-overlay" onClick={() => setIsCartOpen(false)}>
      <div className="cart-drawer" onClick={e => e.stopPropagation()}>
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button className="close-cart" onClick={() => setIsCartOpen(false)}>×</button>
        </div>

        <div className="cart-items">
          {cartItems.length === 0 ? (
            <div className="empty-cart">Your cart is empty.</div>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.image_url} alt={item.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <h4>{item.name}</h4>
                  <p>₹ {new Intl.NumberFormat('en-IN').format(Number(item.price))}</p>
                </div>
                <button className="remove-item" onClick={() => removeFromCart(item.id)}>Remove</button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary-line">
              <span>Subtotal:</span>
              <span>₹ {new Intl.NumberFormat('en-IN').format(subtotal)}</span>
            </div>
            <div className="cart-summary-line">
              <span>IndiaPost Shipping:</span>
              <span>₹ {new Intl.NumberFormat('en-IN').format(shippingCost)}</span>
            </div>
            <div className="cart-summary-total">
              <span>Total:</span>
              <span>₹ {new Intl.NumberFormat('en-IN').format(total)}</span>
            </div>
            
            <button className="btn-checkout" onClick={handleCheckout}>
              {user ? 'Proceed to Checkout' : 'Login to Checkout'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
