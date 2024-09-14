import { Body, Controller, Delete, Get, Post, Query } from "@nestjs/common";
import { GameService } from "./game.service";

import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';

interface GameState {
  servers: { [id: number]: {
    players: { [id: number]: {
      username: string,
      score: number
    }}
  }}
}

@WebSocketGateway()
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly gameService: GameService) {}

  @WebSocketServer() server: Server;
  private gameState: GameState = { servers: {} };

  handleConnection(client: WebSocket) {
    const url = client.url;
    const params = new URLSearchParams(url.split('?')[1]);
    
    const lobbyCode = params.get("lobbyCode")
    const username = params.get('username')
    const playerId = this.generateId();

    if (this.gameState.servers[lobbyCode] === null){
      this.gameState.servers[lobbyCode] = {players: {}}
    }

    this.gameState.servers[lobbyCode].players[playerId] = {
      username: username,
      score: 0
    }
  
    client.send(
      JSON.stringify({ event: 'connected', playerId: playerId, username }),
    );
  
    console.log(`Player ${username} with ID ${playerId} connected.`);
  }

  handleDisconnect(client: WebSocket) {
    const url = client.url;
    const params = new URLSearchParams(url.split('?')[1]);

    const lobbyCode = params.get("lobbyCode")
    const playerId = params.get("playerId")
    delete this.gameState.servers[lobbyCode].players[playerId]
    console.log(`Client ID: ${playerId} disconnected`);
  }

  private broadcast(event: string, data: any) {
    this.server.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ event, data }));
      }
    });
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

