"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const index_1 = require("../index");
class ClientHandler {
    mul(server, a, b) {
        return a * b;
    }
    div(server, a, b) {
        return a / b;
    }
}
__decorate([
    index_1.rpc
], ClientHandler.prototype, "mul", null);
__decorate([
    index_1.rpc
], ClientHandler.prototype, "div", null);
const handler = new ClientHandler();
const socket = socket_io_client_1.default('ws://localhost:3000');
function testServerRpc(serverProxy) {
    return __awaiter(this, void 0, void 0, function* () {
        let val = yield serverProxy.add(5, 2);
        console.log('serverProxy.add(5, 2) = ', val);
        val = yield serverProxy.sub(5, 2);
        console.log('serverProxy.sub(5, 2) = ', val);
    });
}
socket.on('connect', () => {
    console.log('connected to server');
    const serverProxy = index_1.rpcBind(socket, handler);
    testServerRpc(serverProxy);
});
//# sourceMappingURL=client.js.map