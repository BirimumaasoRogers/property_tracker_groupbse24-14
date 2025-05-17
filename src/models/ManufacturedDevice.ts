import { Schema, model, models } from "mongoose";

const ManufacturedDeviceSchema = new Schema({
  trackerId: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  collection: "manufacturedDevices"
});

export default models.ManufacturedDevices || model("ManufacturedDevices", ManufacturedDeviceSchema);