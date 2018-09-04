import io from 'socket.io-client'
import {rpcBind, rpc} from '../index'

class ClientHandler {
    @rpc
    public mul(server: any, a: number, b: number) {
        return a * b
    }

    @rpc
    public div(server: any, a: number, b: number) {
        return a / b
    }
}

const handler = new ClientHandler()

const socket = io('ws://localhost:3000')

async function testServerRpc(serverProxy: any) {
    let val = await serverProxy.add(5, 2)
    console.log('serverProxy.add(5, 2) = ', val)
    val = await serverProxy.sub(5, 2)
    console.log('serverProxy.sub(5, 2) = ', val)
}

socket.on('connect', () => {
    console.log('connected to server')
    const serverProxy = rpcBind(socket, handler)
    testServerRpc(serverProxy)
})
