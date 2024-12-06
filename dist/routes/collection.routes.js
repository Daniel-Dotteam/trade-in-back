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
// Create a collection
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        const collection = yield server_1.prisma.collection.create({
            data: { name }
        });
        res.json(collection);
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to create collection' });
    }
}));
// Get all collections
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collections = yield server_1.prisma.collection.findMany({
            include: {
                products: true
            }
        });
        res.json(collections);
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to fetch collections' });
    }
}));
// Get collection by ID
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collection = yield server_1.prisma.collection.findUnique({
            where: { id: req.params.id },
            include: {
                products: true
            }
        });
        if (!collection) {
            return res.status(404).json({ error: 'Collection not found' });
        }
        res.json(collection);
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to fetch collection' });
    }
}));
// Update collection
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        const collection = yield server_1.prisma.collection.update({
            where: { id: req.params.id },
            data: { name }
        });
        res.json(collection);
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to update collection' });
    }
}));
// Delete collection
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield server_1.prisma.collection.delete({
            where: { id: req.params.id }
        });
        res.json({ message: 'Collection deleted successfully' });
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to delete collection' });
    }
}));
// Add this new endpoint to get products by collection ID and type
router.get('/:id/products', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type } = req.query;
        const products = yield server_1.prisma.product.findMany({
            where: {
                collectionId: req.params.id,
                type: type
            }
        });
        res.json(products);
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to fetch products for collection' });
    }
}));
exports.default = router;
//# sourceMappingURL=collection.routes.js.map