// MongoDBに接続
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/teamlab-step3', {useMongoClient: true});
var Schema = mongoose.Schema;

// ユーザースキーマ定義
var userSchema = new Schema({
  name : String,
  password : String,
  backColor : {
    type: [Number],
    default: [186,0,114]
  },
  faceColor : {
    type: [Number],
    default: [255,192,203]
  },
  hairColor : {
    type: [Number],
    default: [255,255,0]
  },
  eyeColor : {
    type: [Number],
    default: [0,0,0]
  },
  colors: [{ type: Schema.Types.ObjectId, ref: 'Color' }]
});
exports.User = mongoose.model('User', userSchema);

// カラースキーマ定義
var colorSchema = new Schema({
  r : Number,
  g : Number,
  b : Number,
  user: { type: Schema.Types.ObjectId, ref: 'User' }
});
exports.Color = mongoose.model('Color', colorSchema);
