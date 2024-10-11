import websockets
from websockets import WebSocketException

class WebSocketClient:
    def __init__(self, url: str):
        self.url = url
        self.websocket = None

    async def connect(self):
        try:
            self.websocket = await websockets.connect(self.url)
            print(f"Connected to WebSocket at {self.url}")
        except Exception as e:
            print(f"Failed to connect to WebSocket: {str(e)}")

    async def send_message(self, destination: str, message: str):
        try:
            if self.websocket is not None:
                # STOMP 형식의 메시지를 전송
                await self.websocket.send(f"SEND\ndestination:{destination}\n\n{message}\u0000")
                print(f"Sent message to {destination}: {message}")
            else:
                print("WebSocket is not connected. Unable to send message.")
        except Exception as e:
            print(f"Failed to send message: {str(e)}")
            return

    async def close(self):
        try:
            if self.websocket is not None:
                await self.websocket.close()
                print("WebSocket connection closed.")
        except Exception as e:
            print(f"Failed to close WebSocket connection: {str(e)}")

    def is_connected(self):
        return self.websocket is not None and self.websocket.open
    
class WebSocketConnectionException(WebSocketException):
    def __init__(self, message="Failed to connect to WebSocket"):
        super().__init__(message)