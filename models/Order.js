import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number,
      price: Number
    }
  ],
  totalPrice: Number,
  status: { type: String, default: 'pendiente' },
  paymentMethod: String, 
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Order', orderSchema);
