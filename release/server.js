"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const koa_router_1 = __importDefault(require("koa-router"));
const koa_body_1 = require("koa-body");
const koa_cors_1 = __importDefault(require("koa-cors"));
const app = new koa_1.default();
app.use((0, koa_cors_1.default)());
app.use((0, koa_body_1.koaBody)());
const router = new koa_router_1.default();
router.post('/proxy/console', (ctx) => {
    const body = ctx.request.body;
    const { console: _console = [], } = body;
    _console.forEach((item) => {
        console[item.method](...item.args);
    });
    ctx.body = '';
});
app.use(router.routes());
exports.default = (config = {
    port: 3000,
}) => {
    const { port = 3000 } = config;
    app.listen(port);
};
