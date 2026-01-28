import { Injectable, Logger } from "@nestjs/common";
import { OnGatewayConnection,ConnectedSocket,MessageBody, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@Injectable()
@WebSocketGateway({
    cors: {
        // origin: process.env.FRONTEND_URL || 'http://localhost:8000',
        origin: '*',
        credentials: true,
    },
    namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private readonly logger = new Logger(ChatGateway.name);

    handleConnection(client: Socket, ...args: any[]) {
        this.logger.log(`Client connected here: ${client.id}`)
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`)
    }

    @SubscribeMessage('send_message')
    handleMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { message: string},
    ) {
        this.logger.log(`Message from client ${client.id}: ${data.message}`)

        //Echo back to sender
        client.emit('message_received', {
            message: data.message,
            from: client.id,
        });
    }

    @SubscribeMessage('ping')
    handlePing(@ConnectedSocket() client: Socket){
        client.emit('pong');
    }
}
