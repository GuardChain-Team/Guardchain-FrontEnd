import { Server as HTTPServer } from "http";
import { Socket as NetSocket } from "net";
import { Server as IOServer } from "socket.io";
import { NextApiResponse } from "next";

interface ServerSocket extends NetSocket {
  server: HTTPServer & {
    io?: IOServer;
  };
}

export interface SocketIONextApiResponse extends NextApiResponse {
  socket: ServerSocket;
}
