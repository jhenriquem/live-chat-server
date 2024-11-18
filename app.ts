import Server from "./config/server";
import WebSocketHandler from "./config/websocket";

const application = new Server()
const wsServer = new WebSocketHandler(application.server)

wsServer.start()
application.onlineServer()
