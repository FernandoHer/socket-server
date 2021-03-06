import express from "express";
import { SERVER_PORT } from "../global/enviroment";
import socketIO from "socket.io";
import http from "http";
import * as socket from "../sockets/socket";

export default class Server {
  private static _intance: Server;

  public app: express.Application;
  public port: number;

  public io: socketIO.Server;
  private httpServer: http.Server;

  private constructor() {
    this.app = express();
    this.port = SERVER_PORT;

    this.httpServer = new http.Server(this.app);
    this.io = socketIO(this.httpServer);

    this.escucharSockets();
  }

  public static get instance() {
    return this._intance || (this._intance = new this());
  }

  private escucharSockets() {
    console.log("escuchando conexiones - sockets");

    this.io.on("connection", (cliente) => {
      // conectar cliente
      socket.conectarCliente(cliente, this.io);

      // Configurar Usuario
      socket.configurarUsuario(cliente, this.io);

      //Obtener usurios activos
      socket.obtenerUsuarios(cliente, this.io);

      // console.log("Cliente conectado");
      console.log("Cliente id", cliente.id);

      // Escuchar Mensajes
      socket.mensaje(cliente, this.io);

      // Desconectar Cliente
      socket.desconectar(cliente, this.io);
    });
  }

  start(callback: any) {
    this.httpServer.listen(this.port, callback);
  }
}
