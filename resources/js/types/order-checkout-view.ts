export interface CheckoutOrderItemType {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export interface CheckoutOrderViewType {
    id: string;
    status: string;
    totalAmount: number;
    paymentMethod: string | null;
    shippingAddress: string | null;
    paymentDueAt: string | null;
    items: CheckoutOrderItemType[];
}
