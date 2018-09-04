"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ProxyHandler_1 = __importDefault(require("./ProxyHandler"));
function rpc(target, method) {
    target.__rpcMethodSet = target.__rpcMethodSet || new Set();
    if (typeof method === 'string') {
        target.__rpcMethodSet.add(method);
    }
    else if (typeof method === 'function') {
        target.__rpcMethodSet.add(method.name);
    }
    else {
        throw TypeError('rpc() should be called with method or method name.');
    }
}
exports.rpc = rpc;
function rpcBind(socket, rpcHandler) {
    const remoteProxy = new Proxy({}, new ProxyHandler_1.default(socket));
    socket.on('__rpc_call', (rpcId, method, params) => {
        if (!rpcHandler.__rpcMethodSet.has(method)) {
            if (rpcId) {
                socket.emit('__rpc_return', rpcId, `RPC Error: Method "${method}" not exported.`, null);
            }
            return;
        }
        let result;
        try {
            result = rpcHandler[method].call(rpcHandler, remoteProxy, ...params);
        }
        catch (e) {
            if (rpcId) {
                socket.emit('__rpc_return', rpcId, e.toString(), null);
            }
        }
        if (!rpcId) {
            return;
        }
        if (result && typeof result.then === 'function') {
            result.then((value) => socket.emit('__rpc_return', rpcId, null, value), (error) => socket.emit('__rpc_return', rpcId, error.toString(), null));
        }
        else {
            socket.emit('__rpc_return', rpcId, null, result);
        }
    });
    return remoteProxy;
}
exports.rpcBind = rpcBind;
//# sourceMappingURL=index.js.map