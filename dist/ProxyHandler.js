"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ProxyHandler {
    constructor(socket) {
        this.methodStubs = new Map();
        this.rpcId = 1;
        this.pendingRpcs = {};
        this.socket = socket;
        socket.on('__rpc_return', (rpcId, error, value) => {
            const rpc = this.pendingRpcs[rpcId];
            if (!rpc) {
                return;
            }
            delete this.pendingRpcs[rpcId];
            if (error) {
                rpc.reject(error);
            }
            else {
                rpc.resolve(value);
            }
        });
    }
    get(target, name) {
        let func = this.methodStubs.get(name);
        if (func) {
            return func;
        }
        func = (...params) => new Promise((resolve, reject) => {
            const reqid = this.rpcId++;
            this.socket.emit('__rpc_call', reqid, name, params);
            this.pendingRpcs[reqid] = { resolve, reject };
        });
        func.noret = (...params) => this.socket.emit('__rpc_call', 0, name, params);
        this.methodStubs.set(name, func);
        return func;
    }
    set() {
        return false;
    }
}
exports.default = ProxyHandler;
//# sourceMappingURL=ProxyHandler.js.map