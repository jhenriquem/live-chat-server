import { Server } from "http";
import { WebSocket, WebSocketServer } from "ws";
import messagesInterface from "../types/messagesType"
import messageModel from "../models/messagesModel";

export default class WebSocketHandler {

  private wsServer: WebSocketServer;

  constructor(server: Server) {
    this.wsServer = new WebSocketServer({ server })

    this.setupConnection()
  }

  private setupConnection() {
    this.wsServer.on("connection", (crrClient) => {


      // Mandar as mensagens para o client que se conectou 
      this.handleSendMessagesToClient(crrClient)

      // Quando o client mandar algo para o servidor 
      this.handleClientMessage(crrClient)

    })
  }


  private handleClientMessage(wsClient: WebSocket) {
    // Quando o client postar uma mensagem no chat, ao postar, ele também manda
    // essa mensagem para o servidor para ser adicionada do banco de dados 
    // Tal metodo, trata desse evento

    wsClient.on("message", (data) => {
      //...
    })

  }

  private async handleSendMessagesToClient(wsClient: WebSocket) {
    //Envia as mensagens para o cliente que se conectou 
    if (wsClient.readyState === WebSocket.OPEN) {
      try {
        const messagesList: messagesInterface[] = await messageModel.find()

        wsClient.send(JSON.stringify({ list: messagesList }))
      }
      catch (err: any) {
        wsClient.send(JSON.stringify({
          status: "Error",
          message: err.message
        }))
        console.log(`Error sending messages to client => ${err.message}`)
      }
    }
  }

  public start() {
    console.log("Active websocket server")
  }

}
