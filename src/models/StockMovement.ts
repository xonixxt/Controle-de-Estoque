import mongoose, { Schema, Document } from 'mongoose';

export interface IStockMovement extends Document {
  product: mongoose.Types.ObjectId;
  type: 'entrada' | 'saida';
  quantity: number;
  user?: mongoose.Types.ObjectId;
  reason?: string;
  createdAt: Date;
}

const StockMovementSchema: Schema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    type: { type: String, enum: ['entrada', 'saida'], required: true },
    quantity: { type: Number, required: true, min: 1 },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    reason: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<IStockMovement>('StockMovement', StockMovementSchema);
