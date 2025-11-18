import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  price: number;
  quantity: number;
  normalizedName?: string;
  owner?: mongoose.Types.ObjectId;
  sku?: string;
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    normalizedName: { type: String, required: true, trim: true, index: true },
    price: { type: Number, required: true, default: 0 },
    quantity: { type: Number, required: true, default: 0 },
    owner: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    sku: { type: String, trim: true, index: true },
  },
  { timestamps: true }
);

const Product = mongoose.model<IProduct>('Product', ProductSchema);
export default Product;
