import { Server } from "http";
import { WebSocket, WebSocketServer } from "ws";
import messagesInterface from "../types/messagesType"
import messageModel from "../models/messagesModel";

interface MsgInterface {
  action: string,
  data: messagesInterface
}

interface ResponseI {
  action: string,
  list?: messagesInterface[]
  messageAdded?: messagesInterface
}

const ACTIONS = {
  NM: "RETURN NEW MESSAGE",
  ML: "RETURN MESSAGE LIST",
}

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

    wsClient.on("message", async (msg: string) => {

      console.log("Mensagem Recebida")
      const data: MsgInterface = JSON.parse(msg)

      const newMessage = new messageModel(data.data)
      const res: ResponseI = {
        action: ACTIONS.NM,
        messageAdded: data.data
      }
      try {
        newMessage.save()
      }
      catch (err: any) {
        console.log(err.message)
        console.log(data)
        //res.status = "Error"
        //res.message = err.message
      }
      wsClient.send(JSON.stringify(res))

      const messagesList: messagesInterface[] = await messageModel.find({}, { _id: 0, __v: 0 })
      const list = messagesList.includes(data.data) ? messagesList : [...messagesList, data.data]
      Array.from(this.wsServer.clients).forEach((client) => {
        if (wsClient !== client) {
          client.send(
            JSON.stringify(
              { action: ACTIONS.ML, list: list })
          )
        }
      })
    })
  }

  private async handleSendMessagesToClient(wsClient: WebSocket) {
    //Envia as mensagens para o cliente que se conectou 
    if (wsClient.readyState === WebSocket.OPEN) {
      try {
        const messagesList: messagesInterface[] = await messageModel.find()

        wsClient.send(JSON.stringify(
          { action: ACTIONS.ML, list: messagesList }))
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
