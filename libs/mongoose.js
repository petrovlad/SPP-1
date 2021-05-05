const mongoose = require('mongoose');

const url = 'mongodb+srv://root_user:L2B5G334MWoxQz66@sppcluster.u3cb2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

mongoose.connect(url, { useNewUrlParser: true });

module.exports = mongoose;
