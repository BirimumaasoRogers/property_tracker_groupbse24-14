import { Schema, model, models } from "mongoose";

const PropertySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  name: { type: String },
  description: { type: String },
  trackerId: { type: String },
  geofence: [
    {
      lat: { type: Number },
      lng: { type: Number }
    }
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default models.Property || model("Property", PropertySchema);