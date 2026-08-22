export interface CartItemBasic {
  price: number;
  quantity: number;
}

export const calculateSubtotal = (items: CartItemBasic[]): number => {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

export const calculateDelivery = (subtotal: number): number => {
  return subtotal > 0 ? 15000 : 0;
};

export const calculateTotal = (subtotal: number, discount: number, delivery: number): number => {
  return subtotal - discount + delivery;
};
