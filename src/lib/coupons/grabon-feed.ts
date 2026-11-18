import { Coupon, MerchantId, Product } from '../../types';

/**
 * GrabOn Verified Coupons Catalog
 * Indexed by store, category, and minimum order requirements.
 * Data modeled from verified GrabOn live coupon feeds for top Indian e-commerce platforms.
 */
export const GRABON_VERIFIED_COUPONS: Coupon[] = [
  // --- FLIPKART COUPONS (GrabOn Verified) ---
  {
    id: 'grabon-fk-01',
    code: 'FKSMART1500',
    title: 'Flat ₹1,500 Off on Premium Smartphones',
    description: 'GrabOn exclusive: Instant discount on flagship smartphones above ₹50,000 on Flipkart.',
    discountType: 'flat',
    discountValue: 1500,
    minOrderValue: 50000,
    verified: true,
    expiresInDays: 5,
    source: 'GrabOn Verified',
    successRate: 97,
    category: 'smartphones',
    merchantId: 'flipkart',
    terms: 'Applicable on select smartphones above ₹50,000. Valid once per user.',
  },
  {
    id: 'grabon-fk-02',
    code: 'FKTECH750',
    title: 'Extra ₹750 Off on Electronics & Audio',
    description: 'Save flat ₹750 on headphones, smartwatches, and electronics on Flipkart.',
    discountType: 'flat',
    discountValue: 750,
    minOrderValue: 10000,
    verified: true,
    expiresInDays: 3,
    source: 'GrabOn Verified',
    successRate: 94,
    category: 'audio',
    merchantId: 'flipkart',
    terms: 'Valid on audio gear, wearables and electronic accessories.',
  },
  {
    id: 'grabon-fk-03',
    code: 'FKLAPTOP2500',
    title: 'Flat ₹2,500 Off on Laptops & Workstations',
    description: 'Extra ₹2,500 off on Apple MacBooks and Windows laptops above ₹60,000 on Flipkart.',
    discountType: 'flat',
    discountValue: 2500,
    minOrderValue: 60000,
    verified: true,
    expiresInDays: 7,
    source: 'GrabOn Verified',
    successRate: 98,
    category: 'laptops',
    merchantId: 'flipkart',
    terms: 'Valid on prepaid transactions for select premium laptops.',
  },
  {
    id: 'grabon-fk-04',
    code: 'FKSPECIAL500',
    title: 'Flat ₹500 Off Sitewide',
    description: 'GrabOn verified general discount on cart value above ₹15,000.',
    discountType: 'flat',
    discountValue: 500,
    minOrderValue: 15000,
    verified: true,
    expiresInDays: 10,
    source: 'GrabOn Verified',
    successRate: 91,
    category: 'all',
    merchantId: 'flipkart',
    terms: 'Valid once per registered Flipkart account.',
  },

  // --- AMAZON INDIA COUPONS (GrabOn Verified) ---
  {
    id: 'grabon-amz-01',
    code: 'AMZTECH1250',
    title: 'Flat ₹1,250 Off on Mobile Phones',
    description: 'Special GrabOn voucher for smartphones and accessories on Amazon India.',
    discountType: 'flat',
    discountValue: 1250,
    minOrderValue: 45000,
    verified: true,
    expiresInDays: 4,
    source: 'GrabOn Verified',
    successRate: 96,
    category: 'smartphones',
    merchantId: 'amazon',
    terms: 'Applies automatically or via promo code entry on Amazon Pay checkout.',
  },
  {
    id: 'grabon-amz-02',
    code: 'AMZAPPLE2000',
    title: 'Flat ₹2,000 Off on Apple Ecosystem',
    description: 'Save flat ₹2,000 on iPhones, iPads, and MacBooks sold by Appario Retail on Amazon.',
    discountType: 'flat',
    discountValue: 2000,
    minOrderValue: 70000,
    verified: true,
    expiresInDays: 6,
    source: 'GrabOn Verified',
    successRate: 98,
    category: 'smartphones',
    merchantId: 'amazon',
    terms: 'Valid on verified Apple authorized seller listings on Amazon.',
  },
  {
    id: 'grabon-amz-03',
    code: 'AMZAUDIO500',
    title: 'Flat ₹500 Off on AirPods & Noise-Cancelling Headphones',
    description: 'Extra ₹500 off on premium wireless earbuds and headphones on Amazon.',
    discountType: 'flat',
    discountValue: 500,
    minOrderValue: 8000,
    verified: true,
    expiresInDays: 8,
    source: 'GrabOn Verified',
    successRate: 93,
    category: 'audio',
    merchantId: 'amazon',
    terms: 'Valid on Sony, Bose, and Apple audio devices.',
  },

  // --- CROMA COUPONS (GrabOn Verified) ---
  {
    id: 'grabon-crm-01',
    code: 'CRMAIR1000',
    title: 'Flat ₹1,000 Off on Premium Tech at Croma',
    description: 'GrabOn exclusive code for online purchases at Croma.com.',
    discountType: 'flat',
    discountValue: 1000,
    minOrderValue: 35000,
    verified: true,
    expiresInDays: 12,
    source: 'GrabOn Verified',
    successRate: 95,
    category: 'all',
    merchantId: 'croma',
    terms: 'Enter coupon during checkout on Croma.com or Tata Neu app.',
  },
  {
    id: 'grabon-crm-02',
    code: 'CRMAPPL1500',
    title: 'Flat ₹1,500 Off on Apple & Flagship Phones',
    description: 'Exclusive Tata Neu / Croma instant coupon on smartphones above ₹60,000.',
    discountType: 'flat',
    discountValue: 1500,
    minOrderValue: 60000,
    verified: true,
    expiresInDays: 5,
    source: 'GrabOn Verified',
    successRate: 97,
    category: 'smartphones',
    merchantId: 'croma',
    terms: 'Instant discount applied at final payment screen.',
  },

  // --- RELIANCE DIGITAL COUPONS (GrabOn Verified) ---
  {
    id: 'grabon-rel-01',
    code: 'RELIANCE1000',
    title: 'Flat ₹1,000 Off on Electronics & Phones',
    description: 'GrabOn verified instant voucher for Reliance Digital web store.',
    discountType: 'flat',
    discountValue: 1000,
    minOrderValue: 40000,
    verified: true,
    expiresInDays: 9,
    source: 'GrabOn Verified',
    successRate: 92,
    category: 'smartphones',
    merchantId: 'reliance_digital',
    terms: 'Valid on prepaid orders on reliancedigital.in.',
  },

  // --- VIJAY SALES COUPONS (GrabOn Verified) ---
  {
    id: 'grabon-vs-01',
    code: 'VSFEST750',
    title: 'Flat ₹750 Off on Laptops and Mobiles',
    description: 'GrabOn verified promo code for Vijay Sales online portal.',
    discountType: 'flat',
    discountValue: 750,
    minOrderValue: 30000,
    verified: true,
    expiresInDays: 14,
    source: 'GrabOn Verified',
    successRate: 90,
    category: 'smartphones',
    merchantId: 'vijay_sales',
    terms: 'Applicable once per user across all Vijay Sales categories.',
  },
];

/**
 * Normalizes product category from title/specs
 */
export function detectProductCategory(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('iphone') || t.includes('phone') || t.includes('galaxy') || t.includes('pixel') || t.includes('oneplus')) {
    return 'smartphones';
  }
  if (t.includes('macbook') || t.includes('laptop') || t.includes('notebook') || t.includes('thinkpad')) {
    return 'laptops';
  }
  if (t.includes('airpods') || t.includes('headphone') || t.includes('earbuds') || t.includes('buds') || t.includes('speaker')) {
    return 'audio';
  }
  return 'all';
}

/**
 * Retrieves all eligible GrabOn coupons for a specific product and optional merchant.
 * Automatically checks:
 * 1. Merchant match
 * 2. Category match (or 'all')
 * 3. Minimum Order Value (MOV) threshold against estimated product price
 */
export function getGrabOnCouponsForProduct(product: Product, merchantId?: MerchantId): Coupon[] {
  const category = detectProductCategory(product.title);
  const minPrice = Math.min(...product.listings.map(l => l.listedPrice));

  return GRABON_VERIFIED_COUPONS.filter(coupon => {
    // 1. Merchant match
    if (merchantId && coupon.merchantId !== merchantId) {
      return false;
    }

    // 2. Category match
    if (coupon.category !== 'all' && coupon.category !== category) {
      return false;
    }

    // 3. Minimum spend threshold check
    if (coupon.minOrderValue && minPrice < coupon.minOrderValue) {
      return false;
    }

    return true;
  });
}
