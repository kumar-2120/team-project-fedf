(function(){try{if(window.performance&&typeof performance.measure==='function'){const _origMeasure=performance.measure.bind(performance);performance.measure=function(name,startMark,endMark){try{if(typeof startMark==='string'&&startMark&&performance.getEntriesByName(startMark).length===0){console.debug('performance.measure skipped: start mark missing ->',startMark);return;}return _origMeasure(name,startMark,endMark);}catch(e){console.debug('performance.measure suppressed error:',e&&e.message?e.message:e);try{return _origMeasure(name);}catch(_){return undefined;}}};}}catch(e){console.debug('performance shim init failed:',e&&e.message?e.message:e);}})();

let products = [];
        let orders = [];
        let cart = [];
        let currentFarmer = null;
        let currentProduct = null;
        let currentDelivery = null;

        function showPage(pageId) {
            document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
            document.getElementById(pageId).classList.add('active');
            
            if (pageId === 'farmer-dashboard') loadFarmerDashboard();
            if (pageId === 'employee-dashboard') loadVerificationList();
            if (pageId === 'quality-dashboard') loadQualityList();
            if (pageId === 'admin-dashboard') loadAdminDashboard();
            if (pageId === 'marketplace') loadMarketplace();
            if (pageId === 'delivery-dashboard') loadDeliveryDashboard();
            if (pageId === 'training') loadTrainingCenter();
        }

        function showModal(modalId) {
            document.getElementById(modalId).classList.add('active');
        }

        function closeModal(modalId) {
            document.getElementById(modalId).classList.remove('active');
        }

        function switchFarmerTab(tabName, el) {
            document.querySelectorAll('#farmer-dashboard .tab').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('#farmer-dashboard .tab-content').forEach(content => content.classList.remove('active'));

           
            if (el && el.classList) el.classList.add('active');
            document.getElementById(tabName + '-tab').classList.add('active');
        }

        function switchTrainingTab(tabName, el) {
            document.querySelectorAll('#training .tab').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('#training .tab-content').forEach(content => content.classList.remove('active'));

      
            if (el && el.classList) el.classList.add('active');
            document.getElementById(tabName + '-training').classList.add('active');
        }

        function farmerLogin() {
            const name = document.getElementById('farmer-name').value;
            const location = document.getElementById('farmer-location').value;
            
            if (name && location) {
                currentFarmer = { name, location };
                document.getElementById('farmer-name-display').textContent = name;
                showPage('farmer-dashboard');
            } else {
                alert('Please fill all required fields');
            }
        }

        function loadFarmerDashboard() {
            loadFarmerProducts();
            loadFarmerOrders();
            loadValueAdditionServices();
        }

        function addProduct() {
            if (!currentFarmer) {
                alert('Please login as a farmer before adding a product.');
                return;
            }
            const product = {
                id: Date.now(),
                name: document.getElementById('product-name').value,
                quantity: parseInt(document.getElementById('product-quantity').value),
                price: parseInt(document.getElementById('product-price').value),
                image: document.getElementById('product-image').value || 'https://via.placeholder.com/300x200?text=Product+Image',
                location: document.getElementById('product-location').value,
                contact: document.getElementById('product-contact').value,
                farmer: currentFarmer.name,
                status: 'pending',
                verified: false,
                quality: null
            };

            products.push(product);
            closeModal('add-product-modal');
            loadFarmerProducts();
            
            document.getElementById('product-name').value = '';
            document.getElementById('product-quantity').value = '';
            document.getElementById('product-price').value = '';
            document.getElementById('product-image').value = '';
            document.getElementById('product-location').value = '';
            document.getElementById('product-contact').value = '';
        }

        function loadFarmerProducts() {
            const container = document.getElementById('farmer-products');
            if (!currentFarmer) {
                container.innerHTML = '<p>Please login as a farmer to view your products.</p>';
                return;
            }

            const farmerProducts = products.filter(p => p.farmer === currentFarmer.name);

            if (farmerProducts.length === 0) {
                container.innerHTML = '<p>No products listed yet. Click "Add New Product" to get started!</p>';
                return;
            }

            container.innerHTML = farmerProducts.map(p => `
                <div class="card">
                    <img src="${p.image}" alt="${p.name}" class="product-image">
                    <h3>${p.name}</h3>
                    <p><strong>Quantity:</strong> ${p.quantity} kg</p>
                    <p><strong>Price:</strong> ₹${p.price}/kg</p>
                    <p><strong>Status:</strong> <span class="status-badge status-${p.status}">${p.status.toUpperCase()}</span></p>
                    ${p.verified ? '<p>✓ Verified by employee</p>' : '<p>⏳ Awaiting verification</p>'}
                    ${p.quality ? `<p><strong>Quality:</strong> ${getQualityLabel(p.quality)} (${p.quality}/10)</p>` : ''}
                    ${p.inMarketplace ? '<p style="color: #28a745;">🛒 Listed in Marketplace</p>' : ''}
                </div>
            `).join('');
        }

        function loadFarmerOrders() {
            const container = document.getElementById('farmer-orders');
            if (!currentFarmer) {
                container.innerHTML = '<p>Please login as a farmer to view your orders.</p>';
                return;
            }

            const farmerOrders = orders.filter(o => 
                products.some(p => p.id === o.productId && p.farmer === currentFarmer.name)
            );

            if (farmerOrders.length === 0) {
                container.innerHTML = '<p>No orders yet.</p>';
                return;
            }

            container.innerHTML = farmerOrders.map(o => {
                const product = products.find(p => p.id === o.productId);
                return `
                    <div class="order-card">
                        <h3>Order #${o.id}</h3>
                        <p><strong>Product:</strong> ${product.name}</p>
                        <p><strong>Quantity:</strong> ${o.quantity} kg</p>
                        <p><strong>Amount:</strong> ₹${o.total}</p>
                        <p><strong>Buyer:</strong> ${o.buyerName}</p>
                        <p><strong>Delivery Address:</strong> ${o.address}</p>
                        <span class="order-status order-${o.status}">${o.status.toUpperCase()}</span>
                    </div>
                `;
            }).join('');
        }

        function loadValueAdditionServices() {
            const container = document.getElementById('value-addition-services');
            const services = [
                {
                    name: 'Rice to Rice Flour',
                    input: 'Rice',
                    output: 'Rice Flour',
                    valueIncrease: '40%',
                    processingTime: '2 days'
                },
                {
                    name: 'Turmeric to Turmeric Powder',
                    input: 'Fresh Turmeric',
                    output: 'Turmeric Powder',
                    valueIncrease: '60%',
                    processingTime: '5 days'
                },
                {
                    name: 'Chili to Chili Powder',
                    input: 'Dry Chili',
                    output: 'Chili Powder',
                    valueIncrease: '50%',
                    processingTime: '3 days'
                },
                {
                    name: 'Millet to Millet Snacks',
                    input: 'Millets',
                    output: 'Ready-to-eat Snacks',
                    valueIncrease: '120%',
                    processingTime: '7 days'
                }
            ];

            container.innerHTML = services.map((s, i) => `
                <div class="card">
                    <h3>${s.name}</h3>
                    <p><strong>Input:</strong> ${s.input}</p>
                    <p><strong>Output:</strong> ${s.output}</p>
                    <p style="color: #28a745; font-weight: bold;">📈 Value Increase: ${s.valueIncrease}</p>
                    <p><strong>Processing Time:</strong> ${s.processingTime}</p>
                    <button class="btn btn-secondary" onclick="requestValueAddition(${i}, '${s.name}', '${s.input}', '${s.output}')">Request Service</button>
                </div>
            `).join('');
        }

        function requestValueAddition(index, name, input, output) {
            document.getElementById('value-addition-details').innerHTML = `
                <h3>${name}</h3>
                <p><strong>Input Required:</strong> ${input}</p>
                <p><strong>Output Product:</strong> ${output}</p>
            `;
            showModal('value-addition-modal');
        }

        function submitValueAdditionRequest() {
            alert('Value addition request submitted! Our team will contact you within 24 hours.');
            closeModal('value-addition-modal');
        }

        function employeeLogin() {
            const id = document.getElementById('employee-id').value;
            if (id) {
                showPage('employee-dashboard');
            } else {
                alert('Please enter employee ID');
            }
        }

        function loadVerificationList() {
            const container = document.getElementById('verification-list');
            const pendingProducts = products.filter(p => !p.verified);
            
            if (pendingProducts.length === 0) {
                container.innerHTML = '<p>No products pending verification.</p>';
                return;
            }

            container.innerHTML = pendingProducts.map(p => `
                <div class="product-card">
                    <img src="${p.image}" alt="${p.name}" class="product-image">
                    <h3>${p.name}</h3>
                    <p><strong>Farmer:</strong> ${p.farmer}</p>
                    <p><strong>Quantity:</strong> ${p.quantity} kg</p>
                    <p><strong>Location:</strong> ${p.location}</p>
                    <p><strong>Contact:</strong> ${p.contact}</p>
                    <button class="btn" onclick="openVerification(${p.id})">Verify Product</button>
                </div>
            `).join('');
        }

        function openVerification(productId) {
            currentProduct = products.find(p => p.id === productId);
            document.getElementById('verification-details').innerHTML = `
                <p><strong>Product:</strong> ${currentProduct.name}</p>
                <p><strong>Farmer:</strong> ${currentProduct.farmer}</p>
                <p><strong>Quantity:</strong> ${currentProduct.quantity} kg</p>
            `;
            showModal('verification-modal');
        }

        function submitVerification() {
            const status = document.getElementById('verification-status').value === 'true';
            
            currentProduct.verified = true;
            currentProduct.verificationStatus = status;
            currentProduct.status = status ? 'verified' : 'rejected';
            
            closeModal('verification-modal');
            loadVerificationList();
        }

        function qualityLogin() {
            const id = document.getElementById('quality-id').value;
            if (id) {
                showPage('quality-dashboard');
            } else {
                alert('Please enter team member ID');
            }
        }

        function loadQualityList() {
            const container = document.getElementById('quality-list');
            const verifiedProducts = products.filter(p => p.verified && p.verificationStatus && !p.quality);
            
            if (verifiedProducts.length === 0) {
                container.innerHTML = '<p>No products pending quality assessment.</p>';
                return;
            }

            container.innerHTML = verifiedProducts.map(p => `
                <div class="product-card">
                    <img src="${p.image}" alt="${p.name}" class="product-image">
                    <h3>${p.name}</h3>
                    <p><strong>Farmer:</strong> ${p.farmer}</p>
                    <p><strong>Quantity:</strong> ${p.quantity} kg</p>
                    <button class="btn" onclick="openQualityRating(${p.id})">Rate Quality</button>
                </div>
            `).join('');
        }

        function openQualityRating(productId) {
            currentProduct = products.find(p => p.id === productId);
            document.getElementById('quality-details').innerHTML = `
                <p><strong>Product:</strong> ${currentProduct.name}</p>
                <p><strong>Farmer:</strong> ${currentProduct.farmer}</p>
            `;
            showModal('quality-modal');
        }

        function submitQualityRating() {
            const rating = parseFloat(document.getElementById('quality-rating').value);
            
            if (rating >= 0 && rating <= 10) {
                currentProduct.quality = rating;
                currentProduct.status = 'approved';
                
                closeModal('quality-modal');
                loadQualityList();
                
                document.getElementById('quality-rating').value = '';
                document.getElementById('quality-report').value = '';
            } else {
                alert('Please enter a valid rating between 0 and 10');
            }
        }

        function getQualityLabel(rating) {
            if (rating <= 2) return '⭐ Poor';
            if (rating <= 4) return '⭐⭐ Average';
            if (rating <= 7) return '⭐⭐⭐ Good';
            if (rating <= 9) return '⭐⭐⭐⭐ Excellent';
            return '⭐⭐⭐⭐⭐ Outstanding';
        }

        function adminLogin() {
            const username = document.getElementById('admin-username').value;
            if (username) {
                showPage('admin-dashboard');
            } else {
                alert('Please enter admin credentials');
            }
        }

        function loadAdminDashboard() {
            document.getElementById('admin-total-products').textContent = products.length;
            document.getElementById('admin-pending-products').textContent = products.filter(p => p.status === 'pending' || !p.quality).length;
            document.getElementById('admin-active-farmers').textContent = new Set(products.map(p => p.farmer)).size;
            document.getElementById('admin-total-orders').textContent = orders.length;
            
            const container = document.getElementById('admin-product-list');
            
            if (products.length === 0) {
                container.innerHTML = '<p>No products in the system yet.</p>';
                return;
            }

            container.innerHTML = products.map(p => `
                <div class="product-card">
                    <img src="${p.image}" alt="${p.name}" class="product-image">
                    <h3>${p.name}</h3>
                    <p><strong>Farmer:</strong> ${p.farmer}</p>
                    <p><strong>Quantity:</strong> ${p.quantity} kg</p>
                    <p><strong>Price:</strong> ₹${p.price}/kg</p>
                    <p><strong>Status:</strong> <span class="status-badge status-${p.status}">${p.status.toUpperCase()}</span></p>
                    <p><strong>Verified:</strong> ${p.verified ? '✓ Yes' : '✗ No'}</p>
                    ${p.quality ? `<p><strong>Quality:</strong> ${getQualityLabel(p.quality)} (${p.quality}/10)</p>` : '<p><strong>Quality:</strong> Not rated yet</p>'}
                    ${p.status === 'approved' && !p.inMarketplace ? `<button class="btn btn-success btn-small" onclick="approveForMarket(${p.id})">Publish to Marketplace</button>` : ''}
                    ${p.inMarketplace ? '<span style="color: #28a745;">✓ In Marketplace</span>' : ''}
                </div>
            `).join('');
        }

        function approveForMarket(productId) {
            const product = products.find(p => p.id === productId);
            product.inMarketplace = true;
            alert('Product approved for marketplace!');
            loadAdminDashboard();
        }

        function deliveryLogin() {
            const id = document.getElementById('delivery-id').value;
            if (id) {
                showPage('delivery-dashboard');
            } else {
                alert('Please enter delivery personnel ID');
            }
        }

        function loadDeliveryDashboard() {
            const container = document.getElementById('delivery-list');
            const deliveries = orders.filter(o => o.status === 'processing' || o.status === 'shipped');
            
            if (deliveries.length === 0) {
                container.innerHTML = '<p>No deliveries scheduled for today.</p>';
                return;
            }

            container.innerHTML = deliveries.map(o => {
                const product = products.find(p => p.id === o.productId);
                return `
                    <div class="delivery-route">
                        <h3>Order #${Math.floor(o.id)}</h3>
                        <p><strong>Product:</strong> ${product.name} (${o.quantity} kg)</p>
                        <p><strong>Pickup:</strong> ${product.location}</p>
                        <p><strong>Delivery:</strong> ${o.address}</p>
                        <p><strong>Customer:</strong> ${o.buyerName} (${o.contact})</p>
                        <p><strong>Status:</strong> <span class="order-status order-${o.status}">${o.status.toUpperCase()}</span></p>
                        <button class="btn btn-small" onclick="viewDeliveryRoute(${o.id})">View Details</button>
                        ${o.status === 'shipped' ? `<button class="btn btn-success btn-small" onclick="markAsDelivered(${o.id})">Mark Delivered</button>` : ''}
                    </div>
                `;
            }).join('');
        }

        function viewDeliveryRoute(orderId) {
            currentDelivery = orders.find(o => o.id === orderId);
            const product = products.find(p => p.id === currentDelivery.productId);
            
            document.getElementById('delivery-route-content').innerHTML = `
                <h3>Order #${Math.floor(currentDelivery.id)}</h3>
                <div class="tracking-timeline">
                    <div class="tracking-step completed">
                        <strong>Order Placed</strong>
                        <p>Customer ordered the product</p>
                    </div>
                    <div class="tracking-step ${currentDelivery.status !== 'processing' ? 'completed' : ''}">
                        <strong>Product Collected</strong>
                        <p>From: ${product.location}</p>
                    </div>
                    <div class="tracking-step ${currentDelivery.status === 'delivered' ? 'completed' : ''}">
                        <strong>Out for Delivery</strong>
                        <p>To: ${currentDelivery.address}</p>
                    </div>
                    <div class="tracking-step ${currentDelivery.status === 'delivered' ? 'completed' : ''}">
                        <strong>Delivered</strong>
                        <p>Product delivered successfully</p>
                    </div>
                </div>
                <p style="margin-top: 20px;"><strong>Distance:</strong> Approx. ${Math.floor(Math.random() * 50) + 10} km</p>
                <p><strong>Estimated Time:</strong> ${Math.floor(Math.random() * 60) + 30} minutes</p>
            `;
            showModal('delivery-route-modal');
        }

        function markAsDelivered(orderId) {
            const order = orders.find(o => o.id === orderId);
            order.status = 'delivered';
            alert('Order marked as delivered!');
            loadDeliveryDashboard();
        }

        function markDelivered() {
            currentDelivery.status = 'delivered';
            closeModal('delivery-route-modal');
            loadDeliveryDashboard();
            alert('Order marked as delivered successfully!');
        }

        function loadTrainingCenter() {
            loadAgriculturalCourses();
            loadFinancialCourses();
            loadValueAdditionCourses();
            loadDigitalCourses();
        }

        function loadAgriculturalCourses() {
            const courses = [
                { title: 'Organic Farming Basics', duration: '45 min', level: 'Beginner' },
                { title: 'Soil Health Management', duration: '60 min', level: 'Intermediate' },
                { title: 'Pest Control Techniques', duration: '50 min', level: 'Intermediate' },
                { title: 'Water Conservation Methods', duration: '40 min', level: 'Beginner' }
            ];
            
            document.getElementById('agricultural-courses').innerHTML = courses.map(c => `
                <div class="training-card" onclick="openTrainingVideo('${c.title}')">
                    <h3>${c.title}</h3>
                    <p>⏱️ Duration: ${c.duration}</p>
                    <p>📊 Level: ${c.level}</p>
                    <p style="margin-top: 10px;">Click to watch →</p>
                </div>
            `).join('');
        }

        function loadFinancialCourses() {
            const courses = [
                { title: 'Basic Accounting for Farmers', duration: '55 min', level: 'Beginner' },
                { title: 'Loan Application Process', duration: '35 min', level: 'Beginner' },
                { title: 'Investment & Savings', duration: '45 min', level: 'Intermediate' },
                { title: 'Government Schemes & Subsidies', duration: '50 min', level: 'Beginner' }
            ];
            
            document.getElementById('financial-courses').innerHTML = courses.map(c => `
                <div class="training-card" onclick="openTrainingVideo('${c.title}')">
                    <h3>${c.title}</h3>
                    <p>⏱️ Duration: ${c.duration}</p>
                    <p>📊 Level: ${c.level}</p>
                    <p style="margin-top: 10px;">Click to watch →</p>
                </div>
            `).join('');
        }

        function loadValueAdditionCourses() {
            const courses = [
                { title: 'Rice Processing Techniques', duration: '60 min', level: 'Intermediate' },
                { title: 'Making Spice Powders', duration: '45 min', level: 'Beginner' },
                { title: 'Snack Production from Millets', duration: '70 min', level: 'Advanced' },
                { title: 'Packaging & Branding', duration: '40 min', level: 'Intermediate' }
            ];
            
            document.getElementById('value-addition-courses').innerHTML = courses.map(c => `
                <div class="training-card" onclick="openTrainingVideo('${c.title}')">
                    <h3>${c.title}</h3>
                    <p>⏱️ Duration: ${c.duration}</p>
                    <p>📊 Level: ${c.level}</p>
                    <p style="margin-top: 10px;">Click to watch →</p>
                </div>
            `).join('');
        }

        function loadDigitalCourses() {
            const courses = [
                { title: 'Online Marketing Basics', duration: '50 min', level: 'Beginner' },
                { title: 'Social Media for Farmers', duration: '45 min', level: 'Beginner' },
                { title: 'Creating Product Listings', duration: '35 min', level: 'Beginner' },
                { title: 'Customer Communication', duration: '40 min', level: 'Intermediate' }
            ];
            
            document.getElementById('digital-courses').innerHTML = courses.map(c => `
                <div class="training-card" onclick="openTrainingVideo('${c.title}')">
                    <h3>${c.title}</h3>
                    <p>⏱️ Duration: ${c.duration}</p>
                    <p>📊 Level: ${c.level}</p>
                    <p style="margin-top: 10px;">Click to watch →</p>
                </div>
            `).join('');
        }

        function openTrainingVideo(title) {
            document.getElementById('training-video-content').innerHTML = `
                <h2>${title}</h2>
                <div class="video-container">
                    <p style="font-size: 3rem; margin: 40px 0;">▶️</p>
                    <p>Training video would play here</p>
                    <p style="margin-top: 20px; font-size: 0.9rem;">In production, this would integrate with video platforms</p>
                </div>
                <div style="margin-top: 20px; color: #333;">
                    <h3>Course Materials</h3>
                    <ul style="padding-left: 20px; margin-top: 10px;">
                        <li>📄 Downloadable PDF Guide</li>
                        <li>📝 Practice Exercises</li>
                        <li>✅ Completion Certificate</li>
                    </ul>
                </div>
            `;
            showModal('training-video-modal');
        }

        function loadMarketplace() {
            const container = document.getElementById('marketplace-products');
            const marketProducts = products.filter(p => p.inMarketplace);
            
            if (marketProducts.length === 0) {
                container.innerHTML = '<p style="text-align: center; padding: 40px;">No products available yet. Check back soon!</p>';
                return;
            }

            container.innerHTML = marketProducts.map(p => `
                <div class="product-marketplace-card">
                    <img src="${p.image}" alt="${p.name}">
                    <div class="product-info">
                        <h3>${p.name}</h3>
                        <p style="color: #666; margin: 10px 0;">By ${p.farmer}</p>
                        <div class="rating">${getQualityLabel(p.quality)}</div>
                        <p style="margin: 10px 0;"><strong>Available:</strong> ${p.quantity} kg</p>
                        <p class="price">₹${p.price}/kg</p>
                        <p style="font-size: 0.9rem; color: #666;"><strong>Location:</strong> ${p.location}</p>
                        <button class="btn" style="width: 100%; margin-top: 10px;" onclick="addToCart(${p.id})">Add to Cart</button>
                    </div>
                </div>
            `).join('');
            
            updateCartCount();
        }

        function addToCart(productId) {
            const product = products.find(p => p.id === productId);
            const existingItem = cart.find(item => item.productId === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    productId: productId,
                    quantity: 1,
                    price: product.price
                });
            }
            
            updateCartCount();
            alert(product.name + ' added to cart!');
        }

        function updateCartCount() {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            document.getElementById('cart-count').textContent = totalItems;
        }

        function showCart() {
            const container = document.getElementById('cart-items');
            
            if (cart.length === 0) {
                container.innerHTML = '<p>Your cart is empty</p>';
                document.getElementById('cart-total').textContent = '0';
            } else {
                let total = 0;
                container.innerHTML = cart.map(item => {
                    const product = products.find(p => p.id === item.productId);
                    const itemTotal = item.quantity * product.price;
                    total += itemTotal;
                    
                    return `
                        <div class="cart-item">
                            <img src="${product.image}" alt="${product.name}">
                            <div style="flex: 1;">
                                <h3>${product.name}</h3>
                                <p>₹${product.price}/kg</p>
                                <div style="margin-top: 10px;">
                                    <button class="btn btn-small" onclick="updateCartQuantity(${item.productId}, -1)">-</button>
                                    <span style="margin: 0 10px;">${item.quantity} kg</span>
                                    <button class="btn btn-small" onclick="updateCartQuantity(${item.productId}, 1)">+</button>
                                </div>
                            </div>
                            <div style="text-align: right;">
                                <p style="font-size: 1.2rem; font-weight: bold;">₹${itemTotal}</p>
                                <button class="btn btn-danger btn-small" onclick="removeFromCart(${item.productId})">Remove</button>
                            </div>
                        </div>
                    `;
                }).join('');
                
                document.getElementById('cart-total').textContent = total;
            }
            
            showModal('cart-modal');
        }

        function updateCartQuantity(productId, change) {
            const item = cart.find(i => i.productId === productId);
            if (item) {
                item.quantity += change;
                if (item.quantity <= 0) {
                    removeFromCart(productId);
                } else {
                    showCart();
                    updateCartCount();
                }
            }
        }

        function removeFromCart(productId) {
            cart = cart.filter(item => item.productId !== productId);
            showCart();
            updateCartCount();
        }

        function checkout() {
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            
            const total = cart.reduce((sum, item) => {
                const product = products.find(p => p.id === item.productId);
                return sum + (item.quantity * product.price);
            }, 0);
            
            document.getElementById('checkout-total').textContent = total;
            closeModal('cart-modal');
            showModal('checkout-modal');
        }

        function placeOrder() {
            const name = document.getElementById('checkout-name').value;
            const address = document.getElementById('checkout-address').value;
            const contact = document.getElementById('checkout-contact').value;
            const payment = document.getElementById('payment-method').value;
            
            if (!name || !address || !contact) {
                alert('Please fill all required fields');
                return;
            }
            
            cart.forEach(item => {
                const product = products.find(p => p.id === item.productId);
                const order = {
                    id: Date.now() + Math.random(),
                    productId: item.productId,
                    quantity: item.quantity,
                    total: item.quantity * product.price,
                    buyerName: name,
                    address: address,
                    contact: contact,
                    paymentMethod: payment,
                    status: 'processing',
                    date: new Date().toLocaleDateString()
                };
                orders.push(order);
                
                product.quantity -= item.quantity;
            });
            
            cart = [];
            updateCartCount();
            
            closeModal('checkout-modal');
            alert('Order placed successfully! You will receive a confirmation shortly.');
            
            document.getElementById('checkout-name').value = '';
            document.getElementById('checkout-address').value = '';
            document.getElementById('checkout-contact').value = '';
            
            setTimeout(() => {
                if (orders.length > 0) {
                    orders[orders.length - 1].status = 'shipped';
                }
            }, 2000);
        }

        function initializeSampleData() {
            products = [
                {
                    id: 1,
                    name: 'Organic Basmati Rice',
                    quantity: 500,
                    price: 80,
                    image:'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
                    location: 'Guntur, Andhra Pradesh',
                    contact: '9876543210',
                    farmer: 'Ravi Kumar',
                    status: 'approved',
                    verified: true,
                    verificationStatus: true,
                    quality: 8.5,
                    qualityReport: 'Excellent grain quality with good aroma',
                    inMarketplace: true
                },
                {
                    id: 2,
                    name: 'Fresh Turmeric',
                    quantity: 200,
                    price: 120,
                    image: 'https://rubber-crimson-cymfs86t66.edgeone.app/download%20(72).jpeg',
                    location: 'Nellore, Andhra Pradesh',
                    contact: '9876543211',
                    farmer: 'Lakshmi Devi',
                    status: 'approved',
                    verified: true,
                    verificationStatus: true,
                    quality: 9.2,
                    qualityReport: 'Premium quality with high curcumin content',
                    inMarketplace: true
                },
                {
                    id: 3,
                    name: 'Red Chili Powder',
                    quantity: 150,
                    price: 200,
                    image: 'https://rubber-crimson-cymfs86t66.edgeone.app/download%20(73).jpeg',
                    location: 'Khammam, Telangana',
                    contact: '9876543212',
                    farmer: 'Venkat Reddy',
                    status: 'approved',
                    verified: true,
                    verificationStatus: true,
                    quality: 8.8,
                    qualityReport: 'Rich color and moderate spice level',
                    inMarketplace: true
                },
                {
                    id: 4,
                    name: 'Jaggery',
                    quantity: 300,
                    price: 60,
                    image:'https://minor-white-auywnlmxai.edgeone.app/download%20(1).jpeg',
                    location: 'Vijayawada, Andhra Pradesh',
                    contact: '9876543213',
                    farmer: 'Sita Rao',
                    status: 'verified',
                    verified: true,
                    verificationStatus: true,
                    quality: 7.5,
                    qualityReport: 'Good quality, natural sweetness',
                    inMarketplace: true
                },
                {
                    id: 5,
                    name: 'Millets Mix',
                    quantity: 250,
                    price: 90,
                    image: 'https://images.unsplash.com/photo-1593617891900-b9c38fbb0144?w=400',
                    location: 'Anantapur, Andhra Pradesh',
                    contact: '9876543214',
                    farmer: 'Krishna Murthy',
                    status: 'pending',
                    verified: false,
                    quality: null,
                    inMarketplace: false
                },
                {
                    id: 6,
                    name: 'Organic Almonds',
                    quantity: 400,
                    price: 110,
                    image: 'https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=400',
                    location: 'Kadapa, Andhra Pradesh',
                    contact: '9876543215',
                    farmer: 'Ramesh Babu',
                    status: 'approved',
                    verified: true,
                    verificationStatus: true,
                    quality: 8.0,
                    qualityReport: 'Fresh and crunchy with good oil content',
                    inMarketplace: true
                }
            ];

            orders = [
                {
                    id: 1001,
                    productId: 1,
                    quantity: 10,
                    total: 800,
                    buyerName: 'Suresh Reddy',
                    address: 'Plot 45, Banjara Hills, Hyderabad',
                    contact: '9988776655',
                    paymentMethod: 'upi',
                    status: 'shipped',
                    date: new Date().toLocaleDateString()
                },
                {
                    id: 1002,
                    productId: 2,
                    quantity: 5,
                    total: 600,
                    buyerName: 'Priya Sharma',
                    address: 'Flat 203, Jubilee Hills, Hyderabad',
                    contact: '9876543298',
                    paymentMethod: 'cod',
                    status: 'processing',
                    date: new Date().toLocaleDateString()
                }
            ];
        }

        initializeSampleData();
        updateCartCount();
    