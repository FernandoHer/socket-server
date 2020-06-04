import { Socket } from "socket.io";
import socketIO from "socket.io";
import { UsuariosLista } from "../classes/usuarios-lista";
import { Usuario } from "../classes/usuario";

export const usuariosConectados = new UsuariosLista();

// Cuando se conecta un usuario
export const conectarCliente = (cliente: Socket, io: socketIO.Server) => {
  const usuario = new Usuario(cliente.id);
  usuariosConectados.agregar(usuario);
};

// Cuando se desconecta un usuario
export const desconectar = (cliente: Socket, io: socketIO.Server) => {
  cliente.on("disconnect", () => {
    console.log("Cliente desconecatado");
    usuariosConectados.borrarUsuario(cliente.id);
    // emitimos los usuarios activos
    io.emit("usuarios-activos", usuariosConectados.getLista());
  });
};

export const mensaje = (cliente: Socket, io: socketIO.Server) => {
  cliente.on("mensaje", (payload: { de: string; cuerpo: string }) => {
    console.log("Mensaje Recibido", payload);

    io.emit("mensaje-nuevo", payload);
  });
};

// configuracion de usuario

export const configurarUsuario = (cliente: Socket, io: socketIO.Server) => {
  cliente.on(
    "configurar-usuario",
    (payload: { nombre: string }, callback: any) => {
      usuariosConectados.actualizarNombre(cliente.id, payload.nombre);
      // emitimos los usuarios activos
      io.emit("usuarios-activos", usuariosConectados.getLista());
      callback({
        ok: true,
        mensaje: `usuario ${payload.nombre} configurado`,
      });
    }
  );
};

// obtener usuarios

export const obtenerUsuarios = (cliente: Socket, io: socketIO.Server) => {
  cliente.on("obtener-usuarios", () => {
    // emitimos los usuarios activos
    io.to(cliente.id).emit("usuarios-activos", usuariosConectados.getLista());
  });
};
