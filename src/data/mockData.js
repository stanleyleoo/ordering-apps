export const categories = ['All', 'Food', 'Beverage', 'Dessert']

export const products = [
  { id: 'FOD-001', name: 'Nasi Goreng', description: 'Indonesian fried rice with egg, chicken, and vegetables', price: 45000, category: 'Food', image: 'https://placehold.co/400x400/E8652D/white?text=Nasi+Goreng', bestseller: true },
  { id: 'FOD-002', name: 'Mie Ayam', description: 'Chicken noodle with seasoned soy sauce and spring onions', price: 38000, category: 'Food', image: 'https://placehold.co/400x400/D4551F/white?text=Mie+Ayam', bestseller: true },
  { id: 'FOD-003', name: 'Chicken Satay', description: 'Grilled chicken skewers with peanut sauce', price: 42000, category: 'Food', image: 'https://placehold.co/400x400/E67E22/white?text=Satay' },
  { id: 'FOD-004', name: 'Caesar Salad', description: 'Fresh romaine lettuce with parmesan and croutons', price: 35000, category: 'Food', image: 'https://placehold.co/400x400/27AE60/white?text=Salad' },
  { id: 'FOD-005', name: 'Beef Burger', description: 'Angus beef patty with cheddar, lettuce, and fries', price: 55000, category: 'Food', image: 'https://placehold.co/400x400/8E44AD/white?text=Burger' },
  { id: 'BEV-001', name: 'Iced Latte', description: 'Espresso with cold milk and ice', price: 32000, category: 'Beverage', image: 'https://placehold.co/400x400/2D9B7A/white?text=Iced+Latte', bestseller: true },
  { id: 'BEV-002', name: 'Matcha Latte', description: 'Premium Japanese matcha with steamed milk', price: 38000, category: 'Beverage', image: 'https://placehold.co/400x400/27AE60/white?text=Matcha' },
  { id: 'BEV-003', name: 'Fresh Orange Juice', description: 'Freshly squeezed orange juice', price: 28000, category: 'Beverage', image: 'https://placehold.co/400x400/F39C12/white?text=Orange+Juice' },
  { id: 'BEV-004', name: 'Espresso', description: 'Double shot espresso', price: 22000, category: 'Beverage', image: 'https://placehold.co/400x400/6E6E73/white?text=Espresso' },
  { id: 'BEV-005', name: 'Mango Smoothie', description: 'Blended mango with yogurt and honey', price: 35000, category: 'Beverage', image: 'https://placehold.co/400x400/F39C12/white?text=Smoothie' },
  { id: 'DES-001', name: 'Banana Pancake', description: 'Fluffy pancakes with caramelized banana and syrup', price: 40000, category: 'Dessert', image: 'https://placehold.co/400x400/D4A83C/white?text=Pancake', bestseller: true },
  { id: 'DES-002', name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with molten center', price: 45000, category: 'Dessert', image: 'https://placehold.co/400x400/8B4513/white?text=Lava+Cake' },
  { id: 'DES-003', name: 'Panna Cotta', description: 'Italian cream dessert with berry compote', price: 38000, category: 'Dessert', image: 'https://placehold.co/400x400/E91E63/white?text=Panna+Cotta' },
  { id: 'DES-004', name: 'Ice Cream Trio', description: 'Three scoops: vanilla, chocolate, strawberry', price: 30000, category: 'Dessert', image: 'https://placehold.co/400x400/FF9800/white?text=Ice+Cream' },
]

export const customers = [
  { id: 'CUS-001', name: 'Budi Santoso', phone: '08123456789', email: 'budi@email.com' },
  { id: 'CUS-002', name: 'Siti Rahma', phone: '08198765432', email: 'siti@email.com' },
  { id: 'CUS-003', name: 'Ahmad Fauzi', phone: '08211223344', email: 'ahmad@email.com' },
]

export const orders = [
  { id: 'ORD-001', customer: customers[0], items: [{ productId: 'BEV-001', name: 'Iced Latte', qty: 2, price: 32000 }, { productId: 'FOD-001', name: 'Nasi Goreng', qty: 1, price: 45000 }], total: 109000, status: 'completed', timestamp: '2026-07-30T18:30:00', paymentMethod: 'QR' },
  { id: 'ORD-002', customer: customers[1], items: [{ productId: 'DES-001', name: 'Banana Pancake', qty: 1, price: 40000 }, { productId: 'BEV-002', name: 'Matcha Latte', qty: 1, price: 38000 }], total: 78000, status: 'preparing', timestamp: '2026-07-30T19:00:00', paymentMethod: 'Cash' },
  { id: 'ORD-003', customer: customers[2], items: [{ productId: 'FOD-003', name: 'Chicken Satay', qty: 2, price: 42000 }, { productId: 'BEV-003', name: 'Fresh Orange Juice', qty: 1, price: 28000 }], total: 112000, status: 'pending', timestamp: '2026-07-30T19:15:00', paymentMethod: 'Card' },
]

export const paymentMethods = [
  { id: 'cash', name: 'Cash', icon: '💰', description: 'Pay at counter' },
  { id: 'qr', name: 'QR Payment', icon: '📱', description: 'GoPay, OVO, DANA, ShopeePay' },
  { id: 'card', name: 'Card', icon: '💳', description: 'Debit / Credit at terminal' },
]
