import ProxyHandler from './ProxyHandler'

export function rpc(target: any, method: string | Function) {
    target.__rpcMethodSet = target.__rpcMethodSet || new Set()
    if (typeof method === 'string') {
        target.__rpcMethodSet.add(method)
    } else if (typeof method === 'function') {
        target.__rpcMethodSet.add(method.name)
    } else {
        throw TypeError('rpc() should be called with method or method name.')
    }
}

export function rpcBind(socket: any, rpcHandler: any) {
    const remoteProxy = new Proxy<any>({}, new ProxyHandler(socket))

    socket.on('__rpc_call', (rpcId: number, method: string, params: any[]) => {
        if (!rpcHandler.__rpcMethodSet.has(method)) {
            if (rpcId) {
                socket.emit('__rpc_return', rpcId, `RPC Error: Method "${method}" not exported.`, null)
            }
            return
        }

        let result
        try {
            result = rpcHandler[method].call(rpcHandler, remoteProxy, ...params)
        } catch (e) {
            if (rpcId) {
                socket.emit('__rpc_return', rpcId, e.toString(), null)
            }
        }
        if (!rpcId) {
            return
        }
        if (result && typeof result.then === 'function') {
            result.then(
                (value: any) => socket.emit('__rpc_return', rpcId, null, value),
                (error: any) => socket.emit('__rpc_return', rpcId, error.toString(), null)
            )
        } else {
            socket.emit('__rpc_return', rpcId, null, result)
        }
    })

    return remoteProxy
}
