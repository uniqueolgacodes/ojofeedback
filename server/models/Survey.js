import mongoose from "mongoose";

const SurveySchema = new mongoose.Schema({
  id: {
    type: String
  },
  user: {
    type: String,
  },
  title: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  questions: {
    type: Array,
    default: []
  },
  submitters: {
    type: Array,
    default: []
  },
  limit: {
    type: Number,
    default: -1
  },
  needAuth: {
    type: Boolean,
    default: false,
  },
  publicResults: {
    type: Boolean,
    default: false
  },
  publicList: {
    type: Boolean,
    default: true,
  },
  date: {
    type: Date,
    default: new Date().toLocaleDateString()
  }
});

const Survey = mongoose.model('Survey', SurveySchema);
export default Survey;