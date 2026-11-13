import { Product, PartnerCardholder, EscrowOrder } from '../types';

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 'apple-iphone-16-128gb',
    title: 'Apple iPhone 16 (128 GB) - Ultramarine',
    category: 'smartphones',
    brand: 'Apple',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=600&q=80'
    ],
    specs: {
      Display: '6.1-inch Super Retina XDR OLED',
      Processor: 'Apple A18 Bionic chip (3nm)',
      Camera: '48MP Fusion + 12MP Ultra-Wide with Macro',
      Battery: 'Up to 22 hours video playback',
      Security: 'Face ID, Emergency SOS via satellite'
    },
    highlights: [
      'Camera Control button for instant photo access',
      'Action Button with customizable shortcuts',
      'Next-Gen Ceramic Shield, 2x tougher glass',
      'Apple Intelligence ready'
    ],
    lowestHistoricalPrice: 71999,
    highestHistoricalPrice: 79900,
    averageHistoricalPrice: 76500,
    priceDropPercentage: 9.3,
    buyRecommendation: 'STRONG_BUY',
    buyRecommendationReason: 'Current price is within 3% of the lowest ever recorded price during Big Billion Days.',
    priceHistory: [
      { date: '2026-06-01', flipkartPrice: 79900, amazonPrice: 79900, cromaPrice: 79900 },
      { date: '2026-07-01', flipkartPrice: 79900, amazonPrice: 78999, cromaPrice: 79900 },
      { date: '2026-08-15', flipkartPrice: 76999, amazonPrice: 77490, cromaPrice: 77990, event: 'Independence Day Sale' },
      { date: '2026-09-25', flipkartPrice: 72999, amazonPrice: 73499, cromaPrice: 74900, event: 'Big Billion Days Start' },
      { date: '2026-10-10', flipkartPrice: 71999, amazonPrice: 72499, cromaPrice: 73990, event: 'Festival Peak' },
      { date: '2026-11-01', flipkartPrice: 74990, amazonPrice: 75490, cromaPrice: 76900 },
      { date: '2026-11-13', flipkartPrice: 73990, amazonPrice: 74900, cromaPrice: 75990 }
    ],
    listings: [
      {
        merchantId: 'flipkart',
        url: 'https://flipkart.com',
        listedPrice: 73990,
        mrp: 79900,
        shippingCost: 0,
        deliveryDays: 1,
        inStock: true,
        rating: 4.7,
        ratingCount: 38402,
        sellerName: 'SuperComNet',
        isAssured: true,
        availableCoupons: [
          {
            id: 'fk-tech-1500',
            code: 'TECHSAVE1500',
            title: 'Flat ₹1,500 Off',
            description: 'Apply on electronics cart value over ₹50,000',
            discountType: 'flat',
            discountValue: 1500,
            minOrderValue: 50000,
            verified: true,
            expiresInDays: 3
          }
        ],
        applicableBankOffers: [
          {
            id: 'axis-fk-instant',
            bank: 'AXIS',
            cardName: 'Flipkart Axis Bank Credit Card',
            cardTier: 'Co-Branded',
            cardType: 'credit',
            discountType: 'percentage',
            discountValue: 5,
            maxDiscount: 4000,
            minOrderValue: 20000,
            exclusiveToMerchant: 'flipkart',
            terms: '5% Instant Cashback applied automatically at checkout'
          },
          {
            id: 'hdfc-cc-instant',
            bank: 'HDFC',
            cardName: 'HDFC Bank Credit Cards',
            cardTier: 'Millennia / Regalia',
            cardType: 'credit',
            discountType: 'flat',
            discountValue: 3500,
            maxDiscount: 3500,
            minOrderValue: 60000,
            terms: 'Flat ₹3,500 Instant Discount on Full Swipe or EMI'
          }
        ]
      },
      {
        merchantId: 'amazon',
        url: 'https://amazon.in',
        listedPrice: 74900,
        mrp: 79900,
        shippingCost: 0,
        deliveryDays: 1,
        inStock: true,
        rating: 4.6,
        ratingCount: 29120,
        sellerName: 'Appario Retail',
        isAssured: true,
        availableCoupons: [
          {
            id: 'az-prime-1000',
            code: 'PRIMEPHONE',
            title: '₹1,000 Coupon',
            description: 'Tick checkmark to apply instant coupon',
            discountType: 'flat',
            discountValue: 1000,
            minOrderValue: 60000,
            verified: true
          }
        ],
        applicableBankOffers: [
          {
            id: 'icici-az-5pct',
            bank: 'ICICI',
            cardName: 'Amazon Pay ICICI Credit Card',
            cardTier: 'Co-Branded',
            cardType: 'credit',
            discountType: 'percentage',
            discountValue: 5,
            maxDiscount: 3750,
            minOrderValue: 10000,
            exclusiveToMerchant: 'amazon',
            terms: '5% Unlimited Cashback for Prime Members'
          },
          {
            id: 'sbi-card-instant',
            bank: 'SBI',
            cardName: 'SBI Credit Card',
            cardTier: 'SimplyCLICK / PRIME',
            cardType: 'credit',
            discountType: 'flat',
            discountValue: 2500,
            maxDiscount: 2500,
            minOrderValue: 50000,
            terms: 'Instant ₹2,500 discount on non-EMI transactions'
          }
        ]
      },
      {
        merchantId: 'croma',
        url: 'https://croma.com',
        listedPrice: 75990,
        mrp: 79900,
        shippingCost: 0,
        deliveryDays: 2,
        inStock: true,
        rating: 4.5,
        ratingCount: 5410,
        sellerName: 'Croma Digital Stores Ltd',
        isAssured: true,
        availableCoupons: [
          {
            id: 'cr-fest-500',
            code: 'CRMAAPPLE500',
            title: 'Flat ₹500 off',
            description: 'Valid across Apple products above ₹60,000',
            discountType: 'flat',
            discountValue: 500,
            minOrderValue: 60000,
            verified: true
          }
        ],
        applicableBankOffers: [
          {
            id: 'hdfc-croma-3000',
            bank: 'HDFC',
            cardName: 'HDFC Bank Credit Cards',
            cardTier: 'All Tiers',
            cardType: 'credit',
            discountType: 'flat',
            discountValue: 3000,
            maxDiscount: 3000,
            minOrderValue: 60000,
            terms: 'Instant discount at POS & online'
          }
        ]
      }
    ]
  },
  {
    id: 'apple-macbook-air-m3-16gb',
    title: 'Apple MacBook Air 13.6" M3 Chip (16GB RAM, 512GB SSD) - Space Grey',
    category: 'laptops',
    brand: 'Apple',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80'
    ],
    specs: {
      Display: '13.6-inch Liquid Retina with True Tone',
      Processor: 'Apple M3 8-core CPU and 10-core GPU',
      Memory: '16GB Unified RAM',
      Storage: '512GB High-speed SSD',
      Battery: 'Up to 18 hours battery life'
    },
    highlights: [
      'Silent, fanless design',
      'Dual external monitor support',
      'MagSafe 3 charging & two Thunderbolt ports',
      '1080p FaceTime HD camera'
    ],
    lowestHistoricalPrice: 114900,
    highestHistoricalPrice: 134900,
    averageHistoricalPrice: 124900,
    priceDropPercentage: 11.2,
    buyRecommendation: 'STRONG_BUY',
    buyRecommendationReason: 'MacBook Air M3 16GB RAM models rarely receive direct bank discounts above ₹5,000.',
    priceHistory: [
      { date: '2026-07-01', flipkartPrice: 134900, amazonPrice: 134900, cromaPrice: 134900 },
      { date: '2026-08-15', flipkartPrice: 129900, amazonPrice: 129990, cromaPrice: 131900 },
      { date: '2026-10-01', flipkartPrice: 119900, amazonPrice: 121900, cromaPrice: 122900, event: 'Diwali Mega Sale' },
      { date: '2026-11-13', flipkartPrice: 117900, amazonPrice: 119900, cromaPrice: 120900 }
    ],
    listings: [
      {
        merchantId: 'flipkart',
        url: 'https://flipkart.com',
        listedPrice: 117900,
        mrp: 134900,
        shippingCost: 0,
        deliveryDays: 2,
        inStock: true,
        rating: 4.8,
        ratingCount: 8904,
        sellerName: 'IndiFlashMart',
        isAssured: true,
        availableCoupons: [
          {
            id: 'fk-lap-2000',
            code: 'MACDEAL2000',
            title: 'Special Laptop Discount ₹2,000',
            description: 'Apply on high-end laptops',
            discountType: 'flat',
            discountValue: 2000,
            minOrderValue: 80000,
            verified: true
          }
        ],
        applicableBankOffers: [
          {
            id: 'hdfc-mac-7500',
            bank: 'HDFC',
            cardName: 'HDFC Bank Credit Cards',
            cardTier: 'All Credit Cards',
            cardType: 'credit',
            discountType: 'flat',
            discountValue: 7500,
            maxDiscount: 7500,
            minOrderValue: 80000,
            terms: 'Flat ₹7,500 Instant Discount on MacBooks'
          }
        ]
      },
      {
        merchantId: 'amazon',
        url: 'https://amazon.in',
        listedPrice: 119900,
        mrp: 134900,
        shippingCost: 0,
        deliveryDays: 1,
        inStock: true,
        rating: 4.8,
        ratingCount: 14200,
        sellerName: 'Appario Retail',
        isAssured: true,
        availableCoupons: [],
        applicableBankOffers: [
          {
            id: 'icici-mac-6000',
            bank: 'ICICI',
            cardName: 'ICICI Bank Credit Cards',
            cardTier: 'Coral / Rubyx / Sapphiro',
            cardType: 'credit',
            discountType: 'flat',
            discountValue: 6000,
            maxDiscount: 6000,
            minOrderValue: 90000,
            terms: 'Instant bank discount at payment gateway'
          }
        ]
      }
    ]
  },
  {
    id: 'sony-wh-1000xm5-anc-headphones',
    title: 'Sony WH-1000XM5 Wireless Active Noise Cancelling Headphones - Silver',
    category: 'audio',
    brand: 'Sony',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'
    ],
    specs: {
      Drivers: '30mm carbon fibre composite driver unit',
      Microphones: '8 microphones with dual noise processors (V1 + QN1)',
      Battery: 'Up to 30 hours with ANC turned ON',
      Charging: '3 mins quick charge = 3 hours playback',
      Bluetooth: 'Multipoint connection (LDAC, AAC, SBC)'
    },
    highlights: [
      'Industry-leading active noise cancellation',
      'Ultra-clear hands-free calling with AI voice beamforming',
      'Speak-to-Chat auto audio pause',
      'Lightweight soft-fit leather'
    ],
    lowestHistoricalPrice: 24990,
    highestHistoricalPrice: 34990,
    averageHistoricalPrice: 28900,
    priceDropPercentage: 17.5,
    buyRecommendation: 'STRONG_BUY',
    buyRecommendationReason: 'Steep price drop combined with instant Axis & HDFC offers brings effective cost under ₹23,000.',
    priceHistory: [
      { date: '2026-06-01', flipkartPrice: 34990, amazonPrice: 34990, cromaPrice: 34990 },
      { date: '2026-08-15', flipkartPrice: 29990, amazonPrice: 29490, cromaPrice: 31990 },
      { date: '2026-10-01', flipkartPrice: 25990, amazonPrice: 26490, cromaPrice: 27990, event: 'Great Indian Festival' },
      { date: '2026-11-13', flipkartPrice: 26990, amazonPrice: 25990, cromaPrice: 28990 }
    ],
    listings: [
      {
        merchantId: 'amazon',
        url: 'https://amazon.in',
        listedPrice: 25990,
        mrp: 34990,
        shippingCost: 0,
        deliveryDays: 1,
        inStock: true,
        rating: 4.6,
        ratingCount: 18740,
        sellerName: 'Electronics Bazaar',
        isAssured: true,
        availableCoupons: [
          {
            id: 'az-audio-1000',
            code: 'AUDIODEAL',
            title: '₹1,000 Instant Coupon',
            description: 'Apply coupon code at checkout',
            discountType: 'flat',
            discountValue: 1000,
            minOrderValue: 20000,
            verified: true
          }
        ],
        applicableBankOffers: [
          {
            id: 'icici-sony-2500',
            bank: 'ICICI',
            cardName: 'Amazon Pay ICICI Card',
            cardTier: 'Co-Branded',
            cardType: 'credit',
            discountType: 'flat',
            discountValue: 2500,
            maxDiscount: 2500,
            minOrderValue: 20000,
            terms: 'Flat ₹2,500 instant discount on Amazon audio products'
          }
        ]
      },
      {
        merchantId: 'flipkart',
        url: 'https://flipkart.com',
        listedPrice: 26990,
        mrp: 34990,
        shippingCost: 0,
        deliveryDays: 2,
        inStock: true,
        rating: 4.5,
        ratingCount: 12100,
        sellerName: 'OmniTech Retail',
        isAssured: true,
        availableCoupons: [],
        applicableBankOffers: [
          {
            id: 'axis-sony-3000',
            bank: 'AXIS',
            cardName: 'Flipkart Axis Bank Credit Card',
            cardTier: 'Co-Branded',
            cardType: 'credit',
            discountType: 'flat',
            discountValue: 3000,
            maxDiscount: 3000,
            minOrderValue: 20000,
            terms: 'Exclusive instant bank discount'
          }
        ]
      }
    ]
  },
  {
    id: 'samsung-galaxy-s24-ultra-512gb',
    title: 'Samsung Galaxy S24 Ultra 5G (Titanium Gray, 12GB RAM, 512GB Storage)',
    category: 'smartphones',
    brand: 'Samsung',
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=600&q=80'
    ],
    specs: {
      Display: '6.8-inch Dynamic AMOLED 2X, 120Hz, 2600 nits',
      Processor: 'Snapdragon 8 Gen 3 for Galaxy',
      Camera: '200MP Quad Telephoto OIS + S-Pen Integrated',
      Battery: '5000 mAh with 45W Fast Charging'
    },
    highlights: [
      'Galaxy AI Live Translate & Circle to Search',
      'Titanium Frame with Corning Gorilla Armor',
      'Integrated S-Pen stylus',
      '7 years of Android OS and security upgrades'
    ],
    lowestHistoricalPrice: 119999,
    highestHistoricalPrice: 139999,
    averageHistoricalPrice: 128999,
    priceDropPercentage: 10.1,
    buyRecommendation: 'FAIR_PRICE',
    buyRecommendationReason: 'Stable pricing. High card discount of ₹6,000 currently active on HDFC.',
    priceHistory: [
      { date: '2026-06-01', flipkartPrice: 139999, amazonPrice: 139999, cromaPrice: 139999 },
      { date: '2026-08-15', flipkartPrice: 131999, amazonPrice: 132499, cromaPrice: 133999 },
      { date: '2026-10-01', flipkartPrice: 121999, amazonPrice: 122999, cromaPrice: 124999 },
      { date: '2026-11-13', flipkartPrice: 124999, amazonPrice: 125999, cromaPrice: 126999 }
    ],
    listings: [
      {
        merchantId: 'flipkart',
        url: 'https://flipkart.com',
        listedPrice: 124999,
        mrp: 139999,
        shippingCost: 0,
        deliveryDays: 1,
        inStock: true,
        rating: 4.7,
        ratingCount: 15400,
        sellerName: 'SuperComNet',
        isAssured: true,
        availableCoupons: [
          {
            id: 'fk-s24-2000',
            code: 'GALAXYSAVE',
            title: 'Flat ₹2,000 Off',
            description: 'Apply on Samsung flagship smartphones',
            discountType: 'flat',
            discountValue: 2000,
            minOrderValue: 90000,
            verified: true
          }
        ],
        applicableBankOffers: [
          {
            id: 'hdfc-s24-6000',
            bank: 'HDFC',
            cardName: 'HDFC Bank Credit Cards',
            cardTier: 'All Credit Cards',
            cardType: 'credit',
            discountType: 'flat',
            discountValue: 6000,
            maxDiscount: 6000,
            minOrderValue: 80000,
            terms: 'Instant bank discount at payment stage'
          }
        ]
      },
      {
        merchantId: 'amazon',
        url: 'https://amazon.in',
        listedPrice: 125999,
        mrp: 139999,
        shippingCost: 0,
        deliveryDays: 1,
        inStock: true,
        rating: 4.6,
        ratingCount: 9230,
        sellerName: 'STPL Exclusive',
        isAssured: true,
        availableCoupons: [],
        applicableBankOffers: [
          {
            id: 'sbi-s24-5000',
            bank: 'SBI',
            cardName: 'SBI Credit Card',
            cardTier: 'All Credit Cards',
            cardType: 'credit',
            discountType: 'flat',
            discountValue: 5000,
            maxDiscount: 5000,
            minOrderValue: 80000,
            terms: 'Flat ₹5,000 instant discount'
          }
        ]
      }
    ]
  }
];

export const MOCK_PARTNER_CARDHOLDERS: PartnerCardholder[] = [
  {
    id: 'partner-rohit-s',
    name: 'Rohit Sharma',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    city: 'Bengaluru',
    trustScore: 99,
    kycVerified: true,
    cardsHeld: [
      {
        id: 'c1',
        bank: 'Axis Bank',
        cardName: 'Flipkart Axis Bank Credit Card',
        last4: '4821',
        network: 'VISA',
        monthlyLimit: 300000,
        availableLimit: 185000,
        billingCycleDate: 15,
        rewardPreference: 'Flipkart Cashback (5%)'
      },
      {
        id: 'c2',
        bank: 'HDFC Bank',
        cardName: 'HDFC Regalia Gold',
        last4: '9012',
        network: 'MASTERCARD',
        monthlyLimit: 500000,
        availableLimit: 320000,
        billingCycleDate: 20,
        rewardPreference: 'Reward Points 4X'
      }
    ],
    totalOrdersFulfilled: 142,
    totalEarnings: 84600,
    rewardPointsEarned: 198000,
    status: 'ACTIVE'
  },
  {
    id: 'partner-priya-m',
    name: 'Priya Mukherjee',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    city: 'Mumbai',
    trustScore: 98,
    kycVerified: true,
    cardsHeld: [
      {
        id: 'c3',
        bank: 'ICICI Bank',
        cardName: 'Amazon Pay ICICI Credit Card',
        last4: '1098',
        network: 'VISA',
        monthlyLimit: 250000,
        availableLimit: 140000,
        billingCycleDate: 5,
        rewardPreference: 'Amazon Pay Cashback'
      },
      {
        id: 'c4',
        bank: 'SBI Card',
        cardName: 'SBI SimplyCLICK Card',
        last4: '7731',
        network: 'VISA',
        monthlyLimit: 200000,
        availableLimit: 110000,
        billingCycleDate: 12,
        rewardPreference: 'Milestone Gift Vouchers'
      }
    ],
    totalOrdersFulfilled: 89,
    totalEarnings: 53200,
    rewardPointsEarned: 112000,
    status: 'ACTIVE'
  },
  {
    id: 'partner-vikram-k',
    name: 'Vikram Kapur',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    city: 'Delhi NCR',
    trustScore: 96,
    kycVerified: true,
    cardsHeld: [
      {
        id: 'c5',
        bank: 'HDFC Bank',
        cardName: 'HDFC Infinia Metal Edition',
        last4: '0044',
        network: 'VISA',
        monthlyLimit: 1000000,
        availableLimit: 740000,
        billingCycleDate: 28,
        rewardPreference: 'SmartBuy 5X Multipliers'
      }
    ],
    totalOrdersFulfilled: 210,
    totalEarnings: 145000,
    rewardPointsEarned: 520000,
    status: 'ACTIVE'
  }
];

export const INITIAL_ORDERS: EscrowOrder[] = [
  {
    id: 'ord-88310',
    orderNumber: 'CC-2026-88310',
    productId: 'apple-iphone-16-128gb',
    productTitle: 'Apple iPhone 16 (128 GB) - Ultramarine',
    productImage: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80',
    merchantId: 'flipkart',
    buyerName: 'Aman Verma',
    buyerPhone: '+91 98765 43210',
    buyerAddress: {
      line1: 'Flat 402, Green Glen Layout, Bellandur',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560103'
    },
    listedPrice: 73990,
    effectivePricePaid: 70040,
    totalSavings: 3950,
    paymentMode: 'PARTNER_ESCROW_UPI',
    partnerId: 'partner-rohit-s',
    partnerName: 'Rohit Sharma',
    partnerCardUsed: 'Flipkart Axis Bank Credit Card (..4821)',
    cardholderCommission: 630,
    platformFee: 420,
    status: 'DISPATCHED',
    merchantOrderRef: 'OD3301928471190',
    awbTrackingNumber: 'EKART-992104-BLR',
    createdAt: '2026-11-12T14:30:00Z',
    estimatedDelivery: '2026-11-14',
    returnWindowEndDate: '2026-11-21'
  }
];
