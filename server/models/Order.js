import { Schema, model } from 'mongoose';

export default model(
  'Order',
  new Schema({
    cummulativeQuoteQty: { required: true, type: String },
    executedQty: { required: true, type: String },
    fills: [{
      commission: { required: true, type: String },
      commissionAsset: { required: true, type: String },
      price: { required: true, type: String },
      qty: { required: true, type: String },
      tradeId: { required: true, type: Number },
    }],
    jobId: { required: true, type: String },
    orderId: { required: true, type: Number },
    origQty: { required: true, type: String },
    status: { required: true, type: String },
    symbol: { required: true, type: String },
    transactTime: { required: true, type: Date },
  }),
);
