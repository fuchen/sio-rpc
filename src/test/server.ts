import server from 'socket.io'
import {rpcBind, rpc} from '../index'

class ServerHandler {
    @rpc
    public add(client: any, a: number, b: number) {
        return a + b
    }

    @rpc
    public sub(client: any, a: number, b: number) {
        return a - b
    }
}

async function testClientRpc(clientProxy: any) {
    let val = await clientProxy.mul(5, 2)
    console.log('clientProxy.mul(5, 2) = ',val)
    val = await clientProxy.div(5, 2)
    console.log('clientProxy.div(5, 2) = ',val)

    try {
        val = await clientProxy.invalidCall()
    } catch(e) {
        console.log(e)
    }
}

const handler = new ServerHandler()

const io = server(3000)
io.on('connection', socket => {
    console.log('client connected')
    const clientProxy = rpcBind(socket, handler)
    testClientRpc(clientProxy)
})
