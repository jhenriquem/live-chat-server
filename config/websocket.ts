import { Server } from "http";
import { WebSocket, WebSocketServer } from "ws";

export default class WebSocketHandler {

  private wsServer: WebSocketServer;
  public clientCount: number

  constructor(server: Server) {
    this.wsServer = new WebSocketServer({ server })
    this.clientCount = 0

    this.setupConnection()
  }

  private setupConnection() {
    this.wsServer.on("connection", (crrClient) => {
      // Indicar que houve uma nova conexão e altera o contador de clientes conectados
      console.log("Novo cliente conectado");
      this.clientCount++
      console.log(`${this.clientCount} clientes conectados`)

      // Mandar as mensagens para o client que se conectou 
      this.handleSendMessagesToClient(crrClient)

      // Quando o client mandar algo para o servidor 
      this.handleClientMessage(crrClient)


      // Atualizar o contador quando o client desconectar 
      crrClient.on("close", () => this.clientCount--)
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

  private handleSendMessagesToClient(wsClient: WebSocket) {
    //Envia as mensagens para o cliente que se conectou 
    if (wsClient.readyState === WebSocket.OPEN) {
      wsClient.send("...")
    }
  }

  public start() {
    console.log("Websocket server ativo ")
  }

}
