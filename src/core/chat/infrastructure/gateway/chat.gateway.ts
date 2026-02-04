import { Injectable, Logger } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer } from "@nestjs/websockets"
import { Server, Socket } from "socket.io";

// Module 2: WebSocket Basics - Gateway Setup
@Injectable()
@WebSocketGateway({
  cors: { origin: '*', credentials: true },
  namespace: '/consultation',
})

export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  // Initialize the gateway after server starts
  afterInit(server: Server) {
    this.logger.log('Chat WebSocket Gateway initialized');
  }

  // Handle client connection
  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  // Handle client disconnection
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}