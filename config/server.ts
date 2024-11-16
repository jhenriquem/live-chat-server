import e, { Application } from "express"
import { createServer } from "http"
import "dotenv/config"

// Estrututa do servidor 
export default class Server {

  private port: string | number
  private app: Application;

  // Publico, pois tem que ser acessado pelo websocket
  public server;

  constructor() {
    this.app = e()
    this.server = createServer(this.app)
    this.port = process.env.PORT || 3000
  }

  onlineServer() {
    try {
      this.server.listen(this.port, () => {
        console.log(`Application running on port ${this.port}`);
      });
    } catch (err: any) {
      console.log(`Some error happened : ${err.message}`);
    }
  }
}

