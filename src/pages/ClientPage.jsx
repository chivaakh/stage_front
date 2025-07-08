import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Heart, 
  Menu,
  Star,
  MapPin,
  Truck,
  Shield,
  ChevronRight,
  Filter,
  Grid,
  List,
  ArrowRight,
  Tag,
  Store,
  TrendingUp,
  Package,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter
} from 'lucide-react';

const ClientEcommercePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(3);
  const [wishlistCount, setWishlistCount] = useState(7);
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [showMenu, setShowMenu] = useState(false);

  // Données simulées
  const categories = [
    { id: 'electronics', name: 'Électronique', icon: '📱', count: 1234 },
    { id: 'fashion', name: 'Mode', icon: '👕', count: 2567 },
    { id: 'home', name: 'Maison', icon: '🏠', count: 890 },
    { id: 'beauty', name: 'Beauté', icon: '💄', count: 456 },
    { id: 'sports', name: 'Sport', icon: '⚽', count: 789 },
    { id: 'books', name: 'Livres', icon: '📚', count: 345 },
    { id: 'toys', name: 'Jouets', icon: '🧸', count: 567 },
    { id: 'automotive', name: 'Auto', icon: '🚗', count: 234 }
  ];

  const featuredProducts = [
    {
      id: 1,
      name: 'iPhone 15 Pro Max',
      price: 1299,
      originalPrice: 1499,
      rating: 4.8,
      reviews: 2547,
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300',
      badge: 'Bestseller',
      discount: 13,
      shipping: 'Livraison gratuite'
    },
    {
      id: 2,
      name: 'MacBook Air M2',
      price: 1199,
      originalPrice: 1399,
      rating: 4.9,
      reviews: 1834,
      image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=300',
      badge: 'Nouveau',
      discount: 14,
      shipping: 'Livraison gratuite'
    },
    {
      id: 3,
      name: 'AirPods Pro',
      price: 249,
      originalPrice: 279,
      rating: 4.7,
      reviews: 3421,
      image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=300',
      badge: 'Promo',
      discount: 11,
      shipping: 'Livraison gratuite'
    },
    {
      id: 4,
      name: 'Samsung Galaxy S24',
      price: 899,
      originalPrice: 999,
      rating: 4.6,
      reviews: 1567,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300',
      badge: 'Populaire',
      discount: 10,
      shipping: 'Livraison express'
    },
    {
      id: 5,
      name: 'Nike Air Max',
      price: 129,
      originalPrice: 159,
      rating: 4.5,
      reviews: 892,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300',
      badge: 'Sport',
      discount: 19,
      shipping: 'Livraison gratuite'
    },
    {
      id: 6,
      name: 'PlayStation 5',
      price: 499,
      originalPrice: 599,
      rating: 4.9,
      reviews: 4523,
      image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=300',
      badge: 'Gaming',
      discount: 17,
      shipping: 'Livraison express'
    }
  ];

  const popularStores = [
    {
      id: 1,
      name: 'TechWorld Store',
      rating: 4.8,
      products: 1247,
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100',
      verified: true,
      speciality: 'Électronique'
    },
    {
      id: 2,
      name: 'Fashion Hub',
      rating: 4.6,
      products: 2891,
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100',
      verified: true,
      speciality: 'Mode'
    },
    {
      id: 3,
      name: 'Home & Living',
      rating: 4.7,
      products: 567,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100',
      verified: false,
      speciality: 'Maison'
    },
    {
      id: 4,
      name: 'Sports Center',
      rating: 4.9,
      products: 1456,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100',
      verified: true,
      speciality: 'Sport'
    }
  ];

  const styles = {
    container: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      backgroundColor: '#f8fafc',
      minHeight: '100vh'
    },
    header: {
      backgroundColor: '#fff',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    },
    topBar: {
      backgroundColor: '#1e293b',
      color: '#fff',
      padding: '8px 0',
      fontSize: '13px',
      textAlign: 'center'
    },
    navbar: {
      padding: '12px 0',
      borderBottom: '1px solid #e2e8f0'
    },
    navContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 16px',
      display: 'flex',
      alignItems: 'center',
      gap: '24px'
    },
    logo: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#6366f1',
      textDecoration: 'none'
    },
    searchBar: {
      flex: 1,
      maxWidth: '600px',
      position: 'relative'
    },
    searchInput: {
      width: '100%',
      padding: '12px 16px 12px 45px',
      border: '2px solid #e2e8f0',
      borderRadius: '25px',
      fontSize: '14px',
      outline: 'none',
      transition: 'all 0.2s',
      backgroundColor: '#f8fafc'
    },
    searchIcon: {
      position: 'absolute',
      left: '15px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#64748b'
    },
    navActions: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px'
    },
    actionButton: {
      position: 'relative',
      padding: '8px',
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      borderRadius: '8px',
      transition: 'all 0.2s',
      color: '#475569'
    },
    badge: {
      position: 'absolute',
      top: '-5px',
      right: '-5px',
      backgroundColor: '#ef4444',
      color: '#fff',
      borderRadius: '50%',
      width: '18px',
      height: '18px',
      fontSize: '11px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold'
    },
    menuCategories: {
      backgroundColor: '#fff',
      borderBottom: '1px solid #e2e8f0',
      padding: '12px 0'
    },
    categoriesContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 16px',
      display: 'flex',
      gap: '32px',
      overflowX: 'auto'
    },
    categoryItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      borderRadius: '20px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      whiteSpace: 'nowrap',
      fontSize: '14px',
      fontWeight: '500'
    },
    main: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '24px 16px'
    },
    heroSection: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '16px',
      padding: '48px',
      color: '#fff',
      marginBottom: '32px',
      position: 'relative',
      overflow: 'hidden'
    },
    heroContent: {
      position: 'relative',
      zIndex: 2
    },
    heroTitle: {
      fontSize: '36px',
      fontWeight: 'bold',
      marginBottom: '16px'
    },
    heroSubtitle: {
      fontSize: '18px',
      marginBottom: '24px',
      opacity: 0.9
    },
    ctaButton: {
      backgroundColor: '#fff',
      color: '#6366f1',
      padding: '12px 32px',
      border: 'none',
      borderRadius: '25px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    section: {
      marginBottom: '48px'
    },
    sectionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px'
    },
    sectionTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1e293b'
    },
    sectionSubtitle: {
      fontSize: '14px',
      color: '#64748b',
      marginTop: '4px'
    },
    viewAllButton: {
      color: '#6366f1',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      fontSize: '14px',
      fontWeight: '500'
    },
    categoriesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
      gap: '16px',
      marginBottom: '32px'
    },
    categoryCard: {
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '12px',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s',
      border: '1px solid #e2e8f0'
    },
    categoryIcon: {
      fontSize: '32px',
      marginBottom: '12px'
    },
    categoryName: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '4px'
    },
    categoryCount: {
      fontSize: '12px',
      color: '#64748b'
    },
    productsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '20px'
    },
    productCard: {
      backgroundColor: '#fff',
      borderRadius: '12px',
      overflow: 'hidden',
      transition: 'all 0.2s',
      border: '1px solid #e2e8f0',
      cursor: 'pointer'
    },
    productImage: {
      width: '100%',
      height: '200px',
      objectFit: 'cover',
      position: 'relative'
    },
    productBadge: {
      position: 'absolute',
      top: '12px',
      left: '12px',
      backgroundColor: '#ef4444',
      color: '#fff',
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: '600'
    },
    wishlistButton: {
      position: 'absolute',
      top: '12px',
      right: '12px',
      backgroundColor: 'rgba(255,255,255,0.9)',
      border: 'none',
      borderRadius: '50%',
      width: '32px',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    productContent: {
      padding: '16px'
    },
    productName: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '8px',
      lineHeight: '1.4'
    },
    productRating: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      marginBottom: '8px'
    },
    productPrice: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '8px'
    },
    currentPrice: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#1e293b'
    },
    originalPrice: {
      fontSize: '14px',
      color: '#64748b',
      textDecoration: 'line-through'
    },
    discount: {
      backgroundColor: '#dcfce7',
      color: '#166534',
      padding: '2px 6px',
      borderRadius: '4px',
      fontSize: '11px',
      fontWeight: '600'
    },
    shipping: {
      fontSize: '12px',
      color: '#059669',
      fontWeight: '500'
    },
    storesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '16px'
    },
    storeCard: {
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      transition: 'all 0.2s',
      cursor: 'pointer'
    },
    storeHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '12px'
    },
    storeImage: {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      objectFit: 'cover'
    },
    storeInfo: {
      flex: 1
    },
    storeName: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1e293b',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    verifiedBadge: {
      color: '#059669',
      fontSize: '14px'
    },
    storeStats: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '12px',
      color: '#64748b'
    },
    footer: {
      backgroundColor: '#1e293b',
      color: '#fff',
      padding: '48px 0 24px',
      marginTop: '64px'
    },
    footerContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 16px'
    },
    footerGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '32px',
      marginBottom: '32px'
    },
    footerSection: {
      fontSize: '14px'
    },
    footerTitle: {
      fontSize: '16px',
      fontWeight: '600',
      marginBottom: '16px'
    },
    footerLink: {
      color: '#cbd5e1',
      textDecoration: 'none',
      display: 'block',
      marginBottom: '8px',
      transition: 'color 0.2s'
    },
    footerBottom: {
      borderTop: '1px solid #374151',
      paddingTop: '24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '14px',
      color: '#9ca3af'
    },
    socialLinks: {
      display: 'flex',
      gap: '16px'
    },
    socialLink: {
      color: '#9ca3af',
      transition: 'color 0.2s',
      cursor: 'pointer'
    }
  };

  return (
    <div style={styles.container}>
      {/* Top Bar */}
      <div style={styles.topBar}>
        🚚 Livraison gratuite à partir de 50€ | ⚡ Expédition sous 24h | 📞 Service client 7j/7
      </div>

      {/* Header */}
      <header style={styles.header}>
        {/* Navbar */}
        <nav style={styles.navbar}>
          <div style={styles.navContainer}>
            {/* Logo */}
            <a href="/" style={styles.logo}>
              Ishrili
            </a>

            {/* Search Bar */}
            <div style={styles.searchBar}>
              <Search size={20} style={styles.searchIcon} />
              <input
                type="text"
                placeholder="Rechercher des produits, marques, boutiques..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  ...styles.searchInput,
                  borderColor: searchQuery ? '#6366f1' : '#e2e8f0'
                }}
              />
            </div>

            {/* Actions */}
            <div style={styles.navActions}>
              <button 
                style={styles.actionButton}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f1f5f9'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <Heart size={20} />
                <span style={styles.badge}>{wishlistCount}</span>
              </button>

              <button 
                style={styles.actionButton}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f1f5f9'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <ShoppingCart size={20} />
                <span style={styles.badge}>{cartCount}</span>
              </button>

              <button 
                style={styles.actionButton}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f1f5f9'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <User size={20} />
              </button>
            </div>
          </div>
        </nav>

        {/* Categories Menu */}
        <div style={styles.menuCategories}>
          <div style={styles.categoriesContainer}>
            {categories.slice(0, 6).map((category) => (
              <div
                key={category.id}
                style={{
                  ...styles.categoryItem,
                  backgroundColor: activeCategory === category.id ? '#6366f1' : 'transparent',
                  color: activeCategory === category.id ? '#fff' : '#475569'
                }}
                onClick={() => setActiveCategory(category.id)}
                onMouseEnter={(e) => {
                  if (activeCategory !== category.id) {
                    e.target.style.backgroundColor = '#f1f5f9';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeCategory !== category.id) {
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </div>
            ))}
            <div style={{ ...styles.categoryItem, color: '#6366f1' }}>
              <Menu size={16} />
              <span>Toutes les catégories</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Hero Section */}
        <section style={styles.heroSection}>
          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>
              Découvrez des milliers de produits
            </h1>
            <p style={styles.heroSubtitle}>
              Des prix imbattables, une qualité exceptionnelle et une livraison rapide
            </p>
            <button 
              style={styles.ctaButton}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Explorer maintenant
            </button>
          </div>
        </section>

        {/* Categories Grid */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>Catégories populaires</h2>
              <p style={styles.sectionSubtitle}>Trouvez exactement ce que vous cherchez</p>
            </div>
            <a href="/categories" style={styles.viewAllButton}>
              Voir tout <ChevronRight size={16} />
            </a>
          </div>
          
          <div style={styles.categoriesGrid}>
            {categories.map((category) => (
              <div
                key={category.id}
                style={styles.categoryCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={styles.categoryIcon}>{category.icon}</div>
                <div style={styles.categoryName}>{category.name}</div>
                <div style={styles.categoryCount}>{category.count} produits</div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>Produits en vedette</h2>
              <p style={styles.sectionSubtitle}>Les meilleures offres du moment</p>
            </div>
            <a href="/products" style={styles.viewAllButton}>
              Voir tout <ChevronRight size={16} />
            </a>
          </div>

          <div style={styles.productsGrid}>
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                style={styles.productCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ position: 'relative' }}>
                  <img 
                    src={product.image} 
                    alt={product.name}
                    style={styles.productImage}
                  />
                  <div style={styles.productBadge}>-{product.discount}%</div>
                  <button style={styles.wishlistButton}>
                    <Heart size={16} />
                  </button>
                </div>
                
                <div style={styles.productContent}>
                  <h3 style={styles.productName}>{product.name}</h3>
                  
                  <div style={styles.productRating}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        fill={i < Math.floor(product.rating) ? '#fbbf24' : 'none'}
                        color="#fbbf24"
                      />
                    ))}
                    <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '4px' }}>
                      ({product.reviews})
                    </span>
                  </div>

                  <div style={styles.productPrice}>
                    <span style={styles.currentPrice}>{product.price}€</span>
                    <span style={styles.originalPrice}>{product.originalPrice}€</span>
                    <span style={styles.discount}>-{product.discount}%</span>
                  </div>

                  <div style={styles.shipping}>
                    <Truck size={12} style={{ marginRight: '4px' }} />
                    {product.shipping}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Stores */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>Boutiques populaires</h2>
              <p style={styles.sectionSubtitle}>Découvrez nos vendeurs de confiance</p>
            </div>
            <a href="/stores" style={styles.viewAllButton}>
              Voir tout <ChevronRight size={16} />
            </a>
          </div>

          <div style={styles.storesGrid}>
            {popularStores.map((store) => (
              <div
                key={store.id}
                style={styles.storeCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={styles.storeHeader}>
                  <img 
                    src={store.image} 
                    alt={store.name}
                    style={styles.storeImage}
                  />
                  <div style={styles.storeInfo}>
                    <div style={styles.storeName}>
                      {store.name}
                      {store.verified && <Shield size={14} style={styles.verifiedBadge} />}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      {store.speciality}
                    </div>
                  </div>
                </div>
                
                <div style={styles.storeStats}>
                  <div>
                    <Star size={12} color="#fbbf24" fill="#fbbf24" style={{ marginRight: '4px' }} />
                    {store.rating}
                  </div>
                  <div>{store.products} produits</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContainer}>
          <div style={styles.footerGrid}>
            <div style={styles.footerSection}>
              <h3 style={styles.footerTitle}>Ishrili</h3>
              <p style={{ color: '#9ca3af', lineHeight: '1.6' }}>
                Votre marketplace de confiance pour des achats en ligne sécurisés et une expérience shopping exceptionnelle.
              </p>
            </div>

            <div style={styles.footerSection}>
              <h3 style={styles.footerTitle}>Aide & Support</h3>
              <a href="/help" style={styles.footerLink}>Centre d'aide</a>
              <a href="/contact" style={styles.footerLink}>Nous contacter</a>
              <a href="/returns" style={styles.footerLink}>Retours & Remboursements</a>
              <a href="/shipping" style={styles.footerLink}>Livraison</a>
            </div>

            <div style={styles.footerSection}>
              <h3 style={styles.footerTitle}>À propos</h3>
              <a href="/about" style={styles.footerLink}>Qui sommes-nous</a>
              <a href="/careers" style={styles.footerLink}>Carrières</a>
              <a href="/press" style={styles.footerLink}>Presse</a>
              <a href="/partnerships" style={styles.footerLink}>Partenariats</a>
            </div>

            <div style={styles.footerSection}>
              <h3 style={styles.footerTitle}>Légal</h3>
              <a href="/privacy" style={styles.footerLink}>Politique de confidentialité</a>
              <a href="/terms" style={styles.footerLink}>Conditions d'utilisation</a>
              <a href="/cookies" style={styles.footerLink}>Cookies</a>
            </div>
          </div>

          <div style={styles.footerBottom}>
            <div>© 2025 Ishrili. Tous droits réservés.</div>
            <div style={styles.socialLinks}>
              <Facebook size={20} style={styles.socialLink} />
              <Instagram size={20} style={styles.socialLink} />
              <Twitter size={20} style={styles.socialLink} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ClientEcommercePage;