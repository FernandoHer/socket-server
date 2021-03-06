import { Router, Request, Response, request } from "express";
import Server from "../classes/server";
import { usuariosConectados } from "../sockets/socket";

export const router = Router();

router.get("/mensajes", (req: Request, res: Response) => {
  res.json({
    ok: true,
    mensaje: "Todo esta bien GET !!!!",
  });
});

router.post("/mensajes", (req: Request, res: Response) => {
  const cuerpo = req.body.cuerpo;
  const de = req.body.de;

  const payload = { cuerpo, de };

  const server = Server.instance;
  server.io.emit("mensaje-nuevo", payload);

  res.json({
    ok: true,
    mensaje: "Todo esta bien POST !!!!",
    cuerpo,
    de,
  });
});

router.post("/mensajes/:id", (req: Request, res: Response) => {
  const cuerpo = req.body.cuerpo;
  const de = req.body.de;
  const id = req.params.id;

  const payload = {
    de,
    cuerpo,
  };

  const server = Server.instance;

  server.io.in(id).emit("mensaje-privado", payload);

  res.json({
    ok: true,
    mensaje: "Todo esta bien POST !!!!",
    cuerpo,
    de,
    id,
  });
});

// Servicio para verificar cuales son ids de los usuarios

router.get("/usuarios", (req: Request, res: Response) => {
  const server = Server.instance;
  server.io.clients((err: any, clientes: string[]) => {
    if (err) {
      return res.json({
        ok: false,
        err,
      });
    }
    res.json({
      ok: true,
      clientes,
    });
  });
});

// Obtener usuarios y sus nombres
router.get("/usuarios/detalle", (req: Request, res: Response) => {
  res.json({
    ok: true,
    clientes: usuariosConectados.getLista(),
  });
});

export default router;
