import { Server } from "socket.io";
import type { NextApiRequest } from "next";
import type { SocketIONextApiResponse } from "@/types/socket";
import type { Transaction } from "@/types/transaction";

const SocketHandler = (req: NextApiRequest, res: SocketIONextApiResponse) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, {
      path: "/api/socket",
      addTrailingSlash: false,
    });

    io.on("connection", (socket) => {
      console.log("Client connected");

      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });

      // Send real-time transaction updates
      socket.on("transaction", (transaction: Transaction) => {
        io.emit("newTransaction", transaction);
      });

      // Send real-time transaction updates
      socket.on("updateTransaction", (transaction: Transaction) => {
        io.emit("updateTransaction", transaction);
      });
    });

    res.socket.server.io = io;
  }

  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default SocketHandler;
