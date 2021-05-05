const mongoose = require('./libs/mongoose');

mongoose.connection.on('open', () => {
    const db = mongoose.connection.db;
    db.dropDatabase((err) => {
        if (err) throw err;
        mongoose.disconnect();
    });
});