'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './symbol.events';

var SymbolSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

registerEvents(SymbolSchema);
export default mongoose.model('Symbol', SymbolSchema);
