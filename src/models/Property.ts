import { Schema, model, models } from "mongoose";

const PropertySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  description: { type: String },
  trackerID: { type: String, required: true },
  geofence: [
    {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    }
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default models.Property || model("Property", PropertySchema);