require('dotenv').config();
const db = require('./config/db');

const products = [
  { name: "iPhone 17 Pro", description: "A19 Pro chip, 6.3-inch Super Retina XDR, titanium design", price: 1199.00, stock: 25, category: "Smartphones", image_url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop" },
  { name: "iPhone 17", description: "A19 chip, 6.1-inch display, all-day battery life", price: 899.00, stock: 40, category: "Smartphones", image_url: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&h=600&fit=crop" },
  { name: "iPhone 16", description: "A18 chip, Dynamic Island, 48MP camera", price: 799.00, stock: 30, category: "Smartphones", image_url: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=600&h=600&fit=crop" },
  { name: "Galaxy S26 Ultra", description: "Snapdragon 8 Gen 5, 200MP camera, S Pen included", price: 1299.00, stock: 20, category: "Smartphones", image_url: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&h=600&fit=crop" },
  { name: "Galaxy S26", description: "Snapdragon 8 Gen 5, 6.2-inch AMOLED 2X", price: 899.00, stock: 35, category: "Smartphones", image_url: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&h=600&fit=crop" },
  { name: "Pixel 10 Pro", description: "Google Tensor G5, AI-powered camera, 6.7-inch OLED", price: 999.00, stock: 28, category: "Smartphones", image_url: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&h=600&fit=crop" },
  { name: "OnePlus 14", description: "Snapdragon 8 Gen 5, 100W fast charging, 120Hz AMOLED", price: 749.00, stock: 30, category: "Smartphones", image_url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop" },
  { name: "Xiaomi 15 Pro", description: "Leica optics, Snapdragon 8 Elite, 90W charging", price: 899.00, stock: 25, category: "Smartphones", image_url: "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=600&h=600&fit=crop" },
  { name: "iPad Pro 13 M4", description: "Ultra Retina XDR, M4 chip, Thunderbolt 4", price: 1299.00, stock: 15, category: "Tablets", image_url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop" },
  { name: "iPad Air 11", description: "M2 chip, 10.9-inch Liquid Retina, lightweight", price: 599.00, stock: 35, category: "Tablets", image_url: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&h=600&fit=crop" },
  { name: "Galaxy Tab S10", description: "AMOLED 2X, Snapdragon 8 Gen 3, S Pen included", price: 899.00, stock: 22, category: "Tablets", image_url: "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=600&h=600&fit=crop" },
  { name: "Surface Pro 11", description: "Snapdragon X Elite, 13-inch PixelSense, AI PC", price: 1099.00, stock: 18, category: "Tablets", image_url: "https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=600&h=600&fit=crop" },
  { name: "Xiaomi Pad 7", description: "11.2-inch 144Hz, Snapdragon 7+ Gen 3", price: 449.00, stock: 30, category: "Tablets", image_url: "https://images.unsplash.com/photo-1638174532921-a4e4f5f6c74e?w=600&h=600&fit=crop" },
  { name: "MacBook Pro 14 M4", description: "M4 Pro chip, Liquid Retina XDR, 18-hour battery", price: 1999.00, stock: 12, category: "Laptops", image_url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop" },
  { name: "MacBook Air 13 M3", description: "M3 chip, 13.6-inch display, fanless, 18-hour battery", price: 1099.00, stock: 25, category: "Laptops", image_url: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&h=600&fit=crop" },
  { name: "Dell XPS 15", description: "Intel Core Ultra 9, RTX 4070, OLED touch", price: 1799.00, stock: 10, category: "Laptops", image_url: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=600&h=600&fit=crop" },
  { name: "ThinkPad X1 Carbon", description: "Intel Core Ultra 7, 14-inch, 2.4 lbs ultralight", price: 1649.00, stock: 14, category: "Laptops", image_url: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&h=600&fit=crop" },
  { name: "HP Spectre x360", description: "Intel Core Ultra 7, 2-in-1 OLED, 16GB RAM", price: 1549.00, stock: 15, category: "Laptops", image_url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop" },
  { name: "Apple Watch Ultra 2", description: "49mm titanium, precision GPS, 36-hour battery", price: 799.00, stock: 22, category: "Smartwatches", image_url: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&h=600&fit=crop" },
  { name: "Apple Watch Series 9", description: "45mm, S9 chip, always-on Retina display", price: 429.00, stock: 40, category: "Smartwatches", image_url: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&h=600&fit=crop" },
  { name: "Galaxy Watch 7", description: "AMOLED, BioActive sensor, 40-hour battery", price: 349.00, stock: 35, category: "Smartwatches", image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop" },
  { name: "Garmin Fenix 8", description: "Rugged multisport GPS, solar charging, 21-day battery", price: 899.00, stock: 15, category: "Smartwatches", image_url: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&h=600&fit=crop" },
  { name: "Amazfit GTR 4", description: "1.43-inch AMOLED, 14-day battery, 150+ sport modes", price: 199.00, stock: 50, category: "Smartwatches", image_url: "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=600&h=600&fit=crop" },
  { name: "AirPods Pro 2", description: "Adaptive Audio, USB-C, Active Noise Cancellation", price: 249.00, stock: 60, category: "AirPods & Earbuds", image_url: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&h=600&fit=crop" },
  { name: "AirPods 4", description: "Open-ear design, Spatial Audio, H2 chip", price: 129.00, stock: 80, category: "AirPods & Earbuds", image_url: "https://images.unsplash.com/photo-1606400082777-ef05f3c5cde2?w=600&h=600&fit=crop" },
  { name: "Galaxy Buds 3 Pro", description: "Adaptive ANC, 360 Audio, 30-hour battery", price: 249.00, stock: 45, category: "AirPods & Earbuds", image_url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop" },
  { name: "Sony WF-1000XM5", description: "Best-in-class ANC, LDAC Hi-Res, 8-hour battery", price: 299.00, stock: 40, category: "AirPods & Earbuds", image_url: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600&h=600&fit=crop" },
  { name: "Nothing Ear 2", description: "Transparent design, Hi-Res Audio, dual connection", price: 149.00, stock: 55, category: "AirPods & Earbuds", image_url: "https://images.unsplash.com/photo-1610438235354-a6ae5528385c?w=600&h=600&fit=crop" },
  { name: "AirPods Max", description: "Spatial Audio, 20-hour battery, premium over-ear", price: 549.00, stock: 20, category: "Headphones", image_url: "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=600&h=600&fit=crop" },
  { name: "Sony WH-1000XM5", description: "Industry-leading ANC, 30-hour battery, Hi-Res", price: 399.00, stock: 40, category: "Headphones", image_url: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop" },
  { name: "Bose QC Ultra", description: "Immersive audio, world-class ANC, premium comfort", price: 429.00, stock: 28, category: "Headphones", image_url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&h=600&fit=crop" },
  { name: "Sennheiser Momentum 4", description: "60-hour battery, adaptive ANC, premium sound", price: 349.00, stock: 30, category: "Headphones", image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop" },
  { name: "Beats Studio Pro", description: "Spatial Audio, 40-hour battery, USB-C lossless", price: 349.00, stock: 35, category: "Headphones", image_url: "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=600&h=600&fit=crop" },
  { name: "MagSafe Charger", description: "15W fast wireless charging, magnetic alignment", price: 39.00, stock: 80, category: "Chargers", image_url: "https://images.unsplash.com/photo-1591290619762-c7ae06ed1c23?w=600&h=600&fit=crop" },
  { name: "Anker 65W GaN", description: "Compact GaN charger, 3 ports, laptop-ready", price: 49.00, stock: 70, category: "Chargers", image_url: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&h=600&fit=crop" },
  { name: "Belkin 3-in-1 Wireless", description: "Charge iPhone, Watch, AirPods simultaneously", price: 149.00, stock: 40, category: "Chargers", image_url: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=600&fit=crop" },
  { name: "Samsung 45W Charger", description: "Super Fast Charging 2.0, USB-C PD 3.0", price: 39.00, stock: 65, category: "Chargers", image_url: "https://images.unsplash.com/photo-1609592806596-b43bada2f4be?w=600&h=600&fit=crop" },
  { name: "Apple 20W USB-C", description: "Compact USB-C power adapter, fast charging", price: 19.00, stock: 100, category: "Chargers", image_url: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&h=600&fit=crop" },
  { name: "USB-C to Lightning", description: "2m braided, MFi certified, fast charging", price: 19.00, stock: 120, category: "Cables", image_url: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=600&h=600&fit=crop" },
  { name: "USB-C to USB-C", description: "2m braided, 100W PD, 4K video support", price: 24.00, stock: 100, category: "Cables", image_url: "https://images.unsplash.com/photo-1613588718956-c2e80305bf61?w=600&h=600&fit=crop" },
  { name: "HDMI 2.1 Cable", description: "8K@60Hz, 4K@120Hz, braided 2m", price: 29.00, stock: 60, category: "Cables", image_url: "https://images.unsplash.com/photo-1597345703386-9c3a33f6d3b1?w=600&h=600&fit=crop" },
  { name: "Thunderbolt 4 Cable", description: "40Gbps data, 100W power, 2m certified", price: 49.00, stock: 45, category: "Cables", image_url: "https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?w=600&h=600&fit=crop" },
  { name: "Braided Lightning", description: "1m premium braided, MFi, tangle-free", price: 14.00, stock: 150, category: "Cables", image_url: "https://images.unsplash.com/photo-1601972599720-36938d4ecd31?w=600&h=600&fit=crop" },
  { name: "Anker 20000mAh", description: "Dual USB-C, 65W output, laptop-ready", price: 79.00, stock: 55, category: "Power Banks", image_url: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&h=600&fit=crop" },
  { name: "Belkin BoostCharge", description: "10000mAh, USB-C PD, slim design", price: 49.00, stock: 65, category: "Power Banks", image_url: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&h=600&fit=crop" },
  { name: "Mophie Powerstation", description: "10000mAh MagSafe compatible, wireless", price: 69.00, stock: 50, category: "Power Banks", image_url: "https://images.unsplash.com/photo-1618413851305-4b96e4c0c8e6?w=600&h=600&fit=crop" },
  { name: "Samsung 10000mAh", description: "Super Fast Charging 25W, dual port", price: 39.00, stock: 75, category: "Power Banks", image_url: "https://images.unsplash.com/photo-1609592806596-b43bada2f4be?w=600&h=600&fit=crop" },
  { name: "Xiaomi 20000mAh", description: "50W fast charge, dual USB-A + USB-C", price: 45.00, stock: 80, category: "Power Banks", image_url: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&h=600&fit=crop" },
  { name: "Silicone Case", description: "Shockproof, MagSafe compatible, soft-touch", price: 29.00, stock: 100, category: "Cases & Covers", image_url: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&h=600&fit=crop" },
  { name: "Leather Case", description: "Premium full-grain leather, MagSafe", price: 59.00, stock: 70, category: "Cases & Covers", image_url: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&h=600&fit=crop" },
  { name: "Clear Case", description: "Crystal clear, anti-yellow, MagSafe ring", price: 19.00, stock: 120, category: "Cases & Covers", image_url: "https://images.unsplash.com/photo-1601593346740-92506ac3da19?w=600&h=600&fit=crop" },
  { name: "Folio Case", description: "Tablet folio with stand, auto sleep/wake", price: 49.00, stock: 55, category: "Cases & Covers", image_url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop" },
  { name: "Rugged Armor", description: "Military-grade drop protection, kickstand", price: 39.00, stock: 85, category: "Cases & Covers", image_url: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&h=600&fit=crop" },
  { name: "Apple Pencil Pro", description: "Pixel-perfect precision, hover, squeeze, barrel roll", price: 129.00, stock: 60, category: "Accessories", image_url: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=600&fit=crop" },
  { name: "Magic Keyboard", description: "Backlit keys, trackpad, USB-C, iPad Pro", price: 299.00, stock: 30, category: "Accessories", image_url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=600&fit=crop" },
  { name: "AirTag 4-Pack", description: "Precision finding, U1 chip, replaceable battery", price: 99.00, stock: 90, category: "Accessories", image_url: "https://images.unsplash.com/photo-1611021061285-60c9c6ba3f0c?w=600&h=600&fit=crop" },
  { name: "Screen Protector", description: "Tempered glass, 9H hardness, 2-pack", price: 14.00, stock: 200, category: "Accessories", image_url: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&h=600&fit=crop" },
  { name: "MagSafe Car Mount", description: "Vent mount, magnetic, one-hand operation", price: 39.00, stock: 70, category: "Accessories", image_url: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&h=600&fit=crop" }
];

async function seed() {
  try {
    console.log('Connected. Clearing old data...');
    await db.query('DELETE FROM order_items');
    await db.query('DELETE FROM products');
    console.log('Inserting ' + products.length + ' products...');
    for (const p of products) {
      await db.query(
        'INSERT INTO products (name, description, price, stock, category, image_url) VALUES (?,?,?,?,?,?)',
        [p.name, p.description, p.price, p.stock, p.category, p.image_url]
      );
    }
    const [rows] = await db.query('SELECT COUNT(*) AS c FROM products');
    console.log('DONE. Total products: ' + rows[0].c);
    process.exit(0);
  } catch (e) {
    console.error('Seed failed:', e.message);
    process.exit(1);
  }
}

seed();
