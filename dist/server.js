"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.prisma = prisma;
const allowedCors = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://exit-deplyment.myshopify.com',
    'https://exit-app-2.myshopify.com'
];
var corsOptions = {
    origin: function (origin, callback) {
        if (!origin)
            return callback(null, true);
        if (allowedCors.indexOf(origin) === -1) {
            const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
};
//middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Import routes with correct paths and extensions
const routerCollection = require('./routes/collection.routes').default;
const routerProduct = require('./routes/product.routes').default;
const routerOrder = require('./routes/order.routes').default;
// Routes
app.use('/api/collections', routerCollection);
app.use('/api/products', routerProduct);
app.use('/api/orders', routerOrder);
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map