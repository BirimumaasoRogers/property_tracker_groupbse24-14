import mongoose, { Schema, model, models } from "mongoose";

const PropertySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String },
  description: { type: String },
  trackerId: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  geofence: [
    {
      lat: { type: Number },
      lng: { type: Number }
    }
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
},
  {
    collection: "properties"
  }
);

export default mongoose.models.Property || mongoose.model("Property", PropertySchema);