import { Schema, model, models } from "mongoose";

const LocationSchema = new Schema({
  trackerId: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  speed: { type: Number },
  timestamp: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default models.Location || model("Location", LocationSchema);