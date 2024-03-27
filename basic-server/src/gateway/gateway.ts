import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from 'socket.io'
import { OnModuleInit } from "@nestjs/common";

@WebSocketGateway()
export class MyGateway implements OnModuleInit {

    @WebSocketServer()
    server: Server;
    // 'newMessage' è il nome dell'evento sul quale
    // il server è in ascolto in questo momento
    // on newMessage() è il metodo che risponde a quell'evento.
    // all'interno di esso vi è la logica.

    onModuleInit() {
        this.server.on('connection', (socket) => {
            console.log(socket.id + " connected");
        });
    }

    @SubscribeMessage('newMessage')
    onNewMessage(@MessageBody() body: any) {
        console.log(body);
        console.log(body["msg"]);

        this.server.emit('onMessage', {
            "message" : "I received: " + body["msg"]
        })
    }
}