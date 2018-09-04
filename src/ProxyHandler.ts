export default class ProxyHandler {
    private socket: any
    private methodStubs = new Map()
    private rpcId = 1
    private pendingRpcs: {
        [key: string]: {
            resolve: (value: any) => void
            reject: (error: any) => void
        }
    } = {}

    constructor(socket: any) {
        this.socket = socket

        socket.on('__rpc_return', (rpcId: number, error: any, value: any) => {
            const rpc = this.pendingRpcs[rpcId]
            if (!rpc) {
                return
            }

            delete this.pendingRpcs[rpcId]

            if (error) {
                rpc.reject(error)
            } else {
                rpc.resolve(value)
            }
        })
    }

    public get(target: any, name: PropertyKey): (...params: any[]) => Promise<any> {
        let func = this.methodStubs.get(name)
        if (func) {
            return func
        }

        func = (...params: any[]) => new Promise((resolve, reject) => {
            const reqid = this.rpcId++
            this.socket.emit('__rpc_call', reqid, name, params)
            this.pendingRpcs[reqid] = { resolve, reject }
        })
        func.noret = (...params: any[]) => this.socket.emit('__rpc_call', 0, name, params)

        this.methodStubs.set(name, func)
        return func
    }

    public set() {
        return false
    }
}
