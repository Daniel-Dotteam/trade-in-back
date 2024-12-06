"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const server_1 = require("../server");
const router = express_1.default.Router();
// Create a product
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, price, type, collectionId } = req.body;
        const product = yield server_1.prisma.product.create({
            data: {
                name,
                price,
                type,
                collectionId
            }
        });
        res.json(product);
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to create product' });
    }
}));
// Get all products
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type } = req.query;
        const products = yield server_1.prisma.product.findMany({
            where: type ? {
                type: type
            } : undefined,
            include: {
                collection: true
            }
        });
        res.json(products);
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to fetch products' });
    }
}));
// Get product by ID
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield server_1.prisma.product.findUnique({
            where: { id: req.params.id },
            include: {
                collection: true
            }
        });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to fetch product' });
    }
}));
// Update product
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, price, type, collectionId } = req.body;
        const product = yield server_1.prisma.product.update({
            where: { id: req.params.id },
            data: {
                name,
                price,
                type,
                collectionId
            }
        });
        res.json(product);
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to update product' });
    }
}));
// Delete product
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield server_1.prisma.product.delete({
            where: { id: req.params.id }
        });
        res.json({ message: 'Product deleted successfully' });
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to delete product' });
    }
}));
exports.default = router;
//# sourceMappingURL=product.routes.js.map