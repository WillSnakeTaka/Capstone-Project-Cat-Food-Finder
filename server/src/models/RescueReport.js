import mongoose from "mongoose";

const rescueReportSchema = new mongoose.Schema(
  {
    catName: { type: String, default: "" },
    city: { type: String, required: true, trim: true },
    contactName: { type: String, required: true, trim: true },
    contactInfo: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    status: { type: String, default: "reported", trim: true },
  },
  { timestamps: true }
);

export const RescueReport = mongoose.model("RescueReport", rescueReportSchema);
