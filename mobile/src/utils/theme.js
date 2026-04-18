export const COLORS = {
  primary:     '#1a1a2e',
  secondary:   '#16213e',
  accent:      '#e94560',
  gold:        '#d4af37',
  cream:       '#faf8f5',
  white:       '#ffffff',
  black:       '#000000',
  gray100:     '#f5f5f5',
  gray200:     '#eeeeee',
  gray300:     '#dddddd',
  gray500:     '#9e9e9e',
  gray700:     '#555555',
  gray900:     '#212121',
  success:     '#10b981',
  warning:     '#f59e0b',
  error:       '#ef4444',
  info:        '#3b82f6',
};

export const FONTS = {
  regular:   '400',
  medium:    '500',
  semiBold:  '600',
  bold:      '700',
  extraBold: '800',
};

export const SIZES = {
  xs:   10,
  sm:   12,
  md:   14,
  lg:   16,
  xl:   18,
  xxl:  22,
  xxxl: 28,
};

export const formatPrice = (amount) => {
  if (!amount && amount !== 0) return '';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getDiscount = (price, originalPrice) => {
  if (!originalPrice || originalPrice === 0) return 0;
  return Math.round((1 - price / originalPrice) * 100);
};

export const truncate = (str, n) => str?.length > n ? str.slice(0, n) + '…' : str;
