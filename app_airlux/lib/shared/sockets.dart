import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'package:socket_io_client/socket_io_client.dart';

initSocket(){
  final IO.Socket socket = IO.io("http://10.0.2.2:3000/",
      OptionBuilder().setTransports(['websocket']).build());
  return socket;
}
void connectSocket(IO.Socket socket) {
  socket.onConnect((data) => print("SocketIO connection etablished"));
  socket.onConnectError((data) => print("SocketIO connection error : $data"));
  socket.onDisconnect((data) => print("socketIO disconnected"));
}