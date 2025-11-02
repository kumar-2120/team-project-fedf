import React, { useState, useEffect } from 'react';
import './App.css';

const initialProducts = [
  { id: 1, name: 'Organic Basmati Rice', quantity: 500, price: 80, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', location: 'Guntur, Andhra Pradesh', contact: '9876543210', farmer: 'Ravi Kumar', status: 'approved', verified: true, verificationStatus: true, quality: 8.5, inMarketplace: true },
  { id: 2, name: 'Fresh Turmeric', quantity: 200, price: 120, image: 'https://rubber-crimson-cymfs86t66.edgeone.app/download%20(72).jpeg', location: 'Nellore, Andhra Pradesh', contact: '9876543211', farmer: 'Lakshmi Devi', status: 'approved', verified: true, verificationStatus: true, quality: 9.2, inMarketplace: true },
  { id: 3, name: 'Red Chili Powder', quantity: 150, price: 200, image: 'https://rubber-crimson-cymfs86t66.edgeone.app/download%20(73).jpeg', location: 'Khammam, Telangana', contact: '9876543212', farmer: 'Venkat Reddy', status: 'approved', verified: true, verificationStatus: true, quality: 8.8, inMarketplace: true },
  { id: 4, name: 'Jaggery', quantity: 300, price: 60, image:'https://minor-white-auywnlmxai.edgeone.app/download%20(1).jpeg', location: 'Vijayawada, Andhra Pradesh', contact: '9876543213', farmer: 'Sita Rao', status: 'verified', verified: true, verificationStatus: true, quality: 7.5, inMarketplace: true },
  { id: 5, name: 'Millets Mix', quantity: 250, price: 90, image: 'https://images.unsplash.com/photo-1593617891900-b9c38fbb0144?w=400', location: 'Anantapur, Andhra Pradesh', contact: '9876543214', farmer: 'Krishna Murthy', status: 'pending', verified: false, quality: null, inMarketplace: false },
  { id: 6, name: 'Organic Almonds', quantity: 400, price: 110, image: 'https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=400', location: 'Kadapa, Andhra Pradesh', contact: '9876543215', farmer: 'Ramesh Babu', status: 'approved', verified: true, verificationStatus: true, quality: 8.0, inMarketplace: true }
];

export default function App() {
  const [page, setPage] = useState('landing');
  const [products, setProducts] = useState(initialProducts);
  const [cart, setCart] = useState([]);
  const [currentFarmer, setCurrentFarmer] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [farmerForm, setFarmerForm] = useState({ name: '', location: '', contact: '' });

  useEffect(() => {
    // update cart count in title (example)
    document.title = `AgriValue (${cart.reduce((s, i) => s + i.quantity, 0)} in cart)`;
  }, [cart]);

  function showPage(p) {
    setPage(p);
    setActiveModal(null);
  }

  function farmerLogin() {
    if (farmerForm.name && farmerForm.location) {
      setCurrentFarmer({ name: farmerForm.name, location: farmerForm.location, contact: farmerForm.contact });
      setPage('farmer-dashboard');
    } else {
      alert('Please fill all required fields');
    }
  }

  function addToCart(productId) {
    const prod = products.find(p => p.id === productId);
    if (!prod) return alert('Product not found');
    setCart(prev => {
      const existing = prev.find(i => i.productId === productId);
      if (existing) return prev.map(i => i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { productId, quantity: 1, price: prod.price }];
    });
    alert(prod.name + ' added to cart!');
  }

  function updateCartQuantity(productId, change) {
    setCart(prev => prev.flatMap(i => {
      if (i.productId !== productId) return i;
      const updated = { ...i, quantity: i.quantity + change };
      if (updated.quantity <= 0) return [];
      return updated;
    }));
  }

  function removeFromCart(productId) {
    setCart(prev => prev.filter(i => i.productId !== productId));
  }

  function checkout() {
    if (cart.length === 0) return alert('Your cart is empty!');
    const total = cart.reduce((sum, item) => {
      const p = products.find(x => x.id === item.productId);
      return sum + (item.quantity * (p?.price || 0));
    }, 0);
    setActiveModal('checkout');
    // store total in modal via state if needed
  }

  function placeOrder(e) {
    e.preventDefault();
    alert('Order placed!');
    setProducts(prev => prev.map(p => {
      const item = cart.find(c => c.productId === p.id);
      if (item) return { ...p, quantity: Math.max(0, p.quantity - item.quantity) };
      return p;
    }));
    setCart([]);
    setActiveModal(null);
    setPage('marketplace');
  }

  function addProduct(form) {
    if (!currentFarmer) return alert('Please login as a farmer before adding a product.');
    const newProduct = {
      id: Date.now(),
      name: form.name || 'New Product',
      quantity: parseInt(form.quantity || '0', 10) || 0,
      price: parseInt(form.price || '0', 10) || 0,
      image: form.image || 'https://via.placeholder.com/300x200?text=Product+Image',
      location: form.location || currentFarmer.location || '',
      contact: form.contact || currentFarmer.contact || '',
      farmer: currentFarmer.name,
      status: 'pending',
      verified: false,
      quality: null,
      inMarketplace: false
    };
    setProducts(prev => [newProduct, ...prev]);
    setActiveModal(null);
  }

  const cartTotal = cart.reduce((sum, item) => {
    const p = products.find(x => x.id === item.productId);
    return sum + (item.quantity * (p?.price || 0));
  }, 0);

  return (
    <div>
      {/* Pages */}
      {page === 'landing' && (
        <div id="landing" className="page active">
          <h1 className="animated-title">🌾 AgriValue</h1>
          <p className="tagline">Empowering Farmers, Enriching Rural Communities</p>
          <div className="role-buttons">
            <button className="role-btn" onClick={() => showPage('farmer-auth')}>
              <h3>👨‍🌾 Farmer</h3>
              <p>Register and sell your agricultural products</p>
            </button>
            <button className="role-btn" onClick={() => showPage('employee-auth')}>
              <h3>🔍 Verification Employee</h3>
              <p>Verify farmer registrations and products</p>
            </button>
            <button className="role-btn" onClick={() => showPage('quality-auth')}>
              <h3>⭐ Quality Team</h3>
              <p>Assess product quality standards</p>
            </button>
            <button className="role-btn" onClick={() => showPage('admin-auth')}>
              <h3>⚙️ Admin</h3>
              <p>Manage export/import operations</p>
            </button>
            <button className="role-btn" onClick={() => showPage('delivery-auth')}>
              <h3>🚚 Delivery Personnel</h3>
              <p>Manage product deliveries</p>
            </button>
            <button className="role-btn" onClick={() => showPage('marketplace')}>
              <h3>🛒 Buyer</h3>
              <p>Browse and purchase quality products</p>
            </button>
            <button className="role-btn" onClick={() => showPage('training')}>
              <h3>📚 Training Center</h3>
              <p>Learn new skills and best practices</p>
            </button>
          </div>
        </div>
      )}

      {page === 'farmer-auth' && (
        <div className="page container">
          <div className="header">
            <h1>Farmer Portal</h1>
            <button className="btn" onClick={() => showPage('landing')}>← Back</button>
          </div>
          <div className="form-group">
            <label>Name</label>
            <input value={farmerForm.name} onChange={e => setFarmerForm(f => ({ ...f, name: e.target.value }))} type="text" placeholder="Enter your name" />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input value={farmerForm.location} onChange={e => setFarmerForm(f => ({ ...f, location: e.target.value }))} type="text" placeholder="Village, District, State" />
          </div>
          <div className="form-group">
            <label>Contact Number</label>
            <input value={farmerForm.contact} onChange={e => setFarmerForm(f => ({ ...f, contact: e.target.value }))} type="tel" placeholder="10-digit mobile number" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Create a secure password" />
          </div>
          <button className="btn" onClick={farmerLogin}>Register / Login</button>
        </div>
      )}

      {page === 'farmer-dashboard' && (
        <div className="page container">
          <div className="header">
            <h1>Farmer Dashboard - <span id="farmer-name-display">{currentFarmer?.name}</span></h1>
            <button className="btn" onClick={() => { setCurrentFarmer(null); showPage('landing'); }}>Logout</button>
          </div>

          <div className="tab-container">
            <button className="tab active">My Products</button>
            <button className="tab">Orders</button>
            <button className="tab">Value Addition</button>
            <button className="tab">Financial Support</button>
          </div>

          <div className="dashboard-grid" style={{ marginTop: 10 }}>
            {products.filter(p => p.farmer === currentFarmer?.name).length === 0 ? (
              <div className="card"><p>No products listed yet. Click "Add New Product" to get started!</p></div>
            ) : (
              products.filter(p => p.farmer === currentFarmer?.name).map(p => (
                <div className="card" key={p.id}>
                  <img src={p.image} alt={p.name} className="product-image" />
                  <h3>{p.name}</h3>
                  <p><strong>Quantity:</strong> {p.quantity} kg</p>
                  <p><strong>Price:</strong> ₹{p.price}/kg</p>
                </div>
              ))
            )}
          </div>

          <div style={{ marginTop: 20 }}>
            <button className="btn btn-secondary" onClick={() => setActiveModal('add-product')}>+ Add New Product</button>
          </div>
        </div>
      )}

      {page === 'marketplace' && (
        <div className="page container">
          <div className="header">
            <h1>🛒 Marketplace</h1>
            <div>
              <button className="btn btn-secondary" onClick={() => setActiveModal('cart')}>🛒 Cart (<span id="cart-count">{cart.reduce((s,i)=>s+i.quantity,0)}</span>)</button>
              <button className="btn" onClick={() => showPage('landing')}>← Back</button>
            </div>
          </div>

          <div className="marketplace-grid">
            {products.filter(p => p.inMarketplace).map(p => (
              <div className="product-marketplace-card" key={p.id}>
                <img src={p.image} alt={p.name} />
                <div className="product-info">
                  <h3>{p.name}</h3>
                  <p style={{color:'#666', margin:'10px 0'}}>By {p.farmer}</p>
                  <div className="rating">{p.quality ? `${p.quality}/10` : ''}</div>
                  <p style={{margin:'10px 0'}}><strong>Available:</strong> {p.quantity} kg</p>
                  <p className="price">₹{p.price}/kg</p>
                  <p style={{fontSize:'.9rem', color:'#666'}}><strong>Location:</strong> {p.location}</p>
                  <button className="btn" style={{width:'100%', marginTop:10}} onClick={() => addToCart(p.id)}>Add to Cart</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals simplified as conditional blocks */}
      {activeModal === 'cart' && (
        <div className="modal active">
          <div className="modal-content">
            <span className="close-modal" onClick={() => setActiveModal(null)}>&times;</span>
            <h2>Shopping Cart</h2>
            <div id="cart-items">
              {cart.length === 0 ? <p>Your cart is empty</p> : cart.map(item => {
                const product = products.find(p => p.id === item.productId);
                const itemTotal = (product?.price || 0) * item.quantity;
                return (
                  <div className="cart-item" key={item.productId}>
                    <img src={product?.image} alt={product?.name} />
                    <div style={{flex:1}}>
                      <h3>{product?.name}</h3>
                      <p>₹{product?.price}/kg</p>
                      <div style={{marginTop:10}}>
                        <button className="btn btn-small" onClick={() => updateCartQuantity(item.productId, -1)}>-</button>
                        <span style={{margin:'0 10px'}}>{item.quantity} kg</span>
                        <button className="btn btn-small" onClick={() => updateCartQuantity(item.productId, 1)}>+</button>
                      </div>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <p style={{fontSize:'1.2rem', fontWeight:'bold'}}>₹{itemTotal}</p>
                      <button className="btn btn-danger btn-small" onClick={() => removeFromCart(item.productId)}>Remove</button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="cart-total">
              <h3>Total: ₹<span id="cart-total">{cartTotal}</span></h3>
              <button className="btn btn-success" onClick={() => { setActiveModal(null); checkout(); }}>Proceed to Checkout</button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'checkout' && (
        <div className="modal active">
          <div className="modal-content">
            <span className="close-modal" onClick={() => setActiveModal(null)}>&times;</span>
            <h2>Checkout</h2>
            <form onSubmit={placeOrder}>
              <div className="form-group">
                <label>Full Name</label>
                <input id="checkout-name" required />
              </div>
              <div className="form-group">
                <label>Delivery Address</label>
                <textarea id="checkout-address" rows={3} required />
              </div>
              <div className="form-group">
                <label>Contact Number</label>
                <input id="checkout-contact" required />
              </div>
              <div className="form-group">
                <label>Payment Method</label>
                <select id="payment-method">
                  <option value="cod">Cash on Delivery</option>
                  <option value="upi">UPI Payment</option>
                </select>
              </div>
              <div className="cart-total">
                <h3>Total Amount: ₹<span id="checkout-total">{cartTotal}</span></h3>
                <button className="btn btn-success" type="submit">Place Order</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeModal === 'add-product' && (
        <AddProductModal onClose={() => setActiveModal(null)} onSubmit={addProduct} currentFarmer={currentFarmer} />
      )}

    </div>
  );
}

function AddProductModal({ onClose, onSubmit, currentFarmer }) {
  const [form, setForm] = useState({ name: '', quantity: '', price: '', image: '', location: currentFarmer?.location || '', contact: currentFarmer?.contact || '' });
  return (
    <div className="modal active">
      <div className="modal-content">
        <span className="close-modal" onClick={onClose}>&times;</span>
        <h2>Add New Product</h2>
        <div className="form-group">
          <label>Product Name</label>
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        </div>
        <div className="form-group">
          <label>Quantity (kg)</label>
          <input type="number" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} />
        </div>
        <div className="form-group">
          <label>Price (₹/kg)</label>
          <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
        </div>
        <div className="form-group">
          <label>Product Image URL</label>
          <input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} />
        </div>
        <div className="form-group">
          <label>Pickup Location</label>
          <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
        </div>
        <div className="form-group">
          <label>Contact Number</label>
          <input value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} />
        </div>
        <button className="btn" onClick={() => onSubmit(form)}>Submit Product</button>
      </div>
    </div>
  );
}
