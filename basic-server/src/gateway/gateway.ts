import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from 'socket.io'
import { OnModuleInit } from "@nestjs/common";

@WebSocketGateway()
export class MyGateway implements OnModuleInit {

    db = {
        "id_prenotazione_1" : {
            "piatto1" : 0,
            "piatto2" : 0,
            "piatto3" : 0
        },
        "id_prenotazione_2" : {
            "piatto4" : 0,
            "piatto5" : 0,
            "piatto6" : 0
        },
    }

    // db per simulare un'ordinazione
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
            // serve per poter rispondere al client con un messaggio di acknowledgement
            // una volta che il messaggio di acknowledgement è stato ricevuto dal client
            // il client può richiedere il menu associato alla prenotazione.

            // trovare un modo di passare dati dal client durante la connessione
            // console.log(socket.handshake.query['id_prenotazione']);
            // if (socket.handshake.query != null) { // significa che ci stiamo connettendo al server socket.
            //     const id_prenotazione: string = socket.handshake.query.id_prenotazione.toString(); 
            //     this.server.to(socket.id).emit('onConnection', { prenotazione : this.db[id_prenotazione]});
            // }
        });
    }
    

    @SubscribeMessage('getMenu')
    onGetMenu(@MessageBody() body: any) {
        const id = body.id;
        console.log(this.db[id]);
        this.server.emit('onReceiveMenu', {
            "prenotazione" : this.db[body['id_prenotazione_1']]
        })
    }

    @SubscribeMessage('increment')
    async onIncrement(@MessageBody() body: any) {
        console.log(body["plate"]);

        // TODO 
        // const result = await this.reservationRepository.find({ ... })
        const result = await (await fetch("https://jsonplaceholder.typicode.com/todos/1")).json();
        
        this.piatti[body["plate"]] += result["id"];
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