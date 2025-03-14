// components/OrderDetailsModal.jsx
import React from 'react';

const OrderDetailsModal = ({ setOpenDetail }) => {
  const orderDetails = {
    id: 's184989823',
    contact: {
      name: 'Tony Nguyen',
      phone: '(+12) 345-678910',
      email: 'hi.avitex@gmail.com'
    },
    shipping: '2163 Phillips Gap Rd, West Jefferson, NC, US',
    billing: '2163 Phillips Gap Rd, West Jefferson, NC, US',
    payment: 'Cash on Delivery',
    company: 'Avitex Technology',
    items: [
      { name: 'Sheepskin Sweatshirt', size: 'XL', color: 'Yellow', qty: 1, price: 45 },
      { name: 'Sheepskin Sweatshirt', size: 'XL', color: 'White', qty: 2, price: 70 }
    ],
    shippingCost: 0,
    discount: 80,
    subtotal: 105
  };

  return (
    <div
      className="modal-order-detail-block fixed inset-0 flex items-center justify-center bg-black/50"
      onClick={() => setOpenDetail(false)}
    >
      <div
        className="modal-order-detail-main grid md:grid-cols-2 max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-xl max-h-[90vh] overflow-y-auto transform transition-all scale-100 opacity-100"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-8 border-r border-gray-200">
          <h3 className="text-2xl font-semibold mb-6">Order Details</h3>
          <div className="space-y-6">
            {Object.entries({
              'Contact Information': `${orderDetails.contact.name}\n${orderDetails.contact.phone}\n${orderDetails.contact.email}`,
              'Shipping Address': orderDetails.shipping,
              'Billing Address': orderDetails.billing,
              'Payment Method': orderDetails.payment,
              'Company': orderDetails.company
            }).map(([label, value]) => (
              <div key={label}>
                <h4 className="text-sm font-medium text-gray-600 uppercase">{label}</h4>
                <p className="mt-2 whitespace-pre-line">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8">
          <h3 className="text-2xl font-semibold mb-6">Items</h3>
          {orderDetails.items.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center py-4 border-b border-gray-100"
            >
              <div className="flex items-center gap-4">
                <img
                  src="/images/product/1000x1000.png"
                  alt={item.name}
                  className="w-20 h-20 rounded object-cover"
                />
                <div>
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-gray-600">
                    {item.size} / {item.color}
                  </p>
                </div>
              </div>
              <p className="font-medium">
                {item.qty} x ${item.price.toFixed(2)}
              </p>
            </div>
          ))}
          
          <div className="mt-6 space-y-4">
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-medium">
                {orderDetails.shippingCost === 0 ? 'Free' : `$${orderDetails.shippingCost.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Discounts</span>
              <span className="font-medium text-red-600">-${orderDetails.discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-4 border-t border-gray-200">
              <span className="text-lg font-semibold">Subtotal</span>
              <span className="text-lg font-semibold">${orderDetails.subtotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;