import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from 'socket.io'
import { OnModuleInit } from "@nestjs/common";

@WebSocketGateway()
export class MyGateway implements OnModuleInit {

    piatti = {
        "piatto1" : 0,
        "piatto2" : 0
    };

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

    @SubscribeMessage('increment')
    onIncrement(@MessageBody() body: any) {
        console.log(body["plate"]);

        this.piatti[body["plate"]] += body["quantity"]
        console.log(this.piatti);

        this.server.emit('onMessage', {
            "ordine" : this.piatti
        })
    }

    @SubscribeMessage('decrement')
    onDecrement(@MessageBody() body: any) {
        console.log(body["plate"]);

        this.piatti[body["plate"]] -= body["quantity"]
        console.log(this.piatti);

        this.server.emit('onMessage', {
            "ordine" : this.piatti
        })      
    }
}