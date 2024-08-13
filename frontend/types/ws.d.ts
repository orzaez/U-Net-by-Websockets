// Este archivo es una definición de tipos para el manejo de WebSocket. 
// Es probable que defina los tipos de datos esperados por la conexión WebSocket, como los eventos y 
// las cargas útiles que el cliente y el servidor intercambian.

declare module 'ws' {
    import { Server as HTTPServer } from 'http';
    import { EventEmitter } from 'events';
  
    class WebSocket extends EventEmitter {
      constructor(address: string, protocols?: string | string[], options?: WebSocket.ClientOptions);
      on(event: 'open' | 'message' | 'close' | 'error', listener: (data?: any) => void): this;
      send(data: any, cb?: (err: Error) => void): void;
      close(code?: number, reason?: string): void;
      terminate(): void;
    }
  
    namespace WebSocket {
      interface ClientOptions {
        protocol?: string;
        agent?: any;
        headers?: { [key: string]: string };
        perMessageDeflate?: boolean;
      }
  
      interface ServerOptions {
        host?: string;
        port?: number;
        backlog?: number;
        server?: HTTPServer;
        verifyClient?: (info: { origin: string; secure: boolean; req: any }) => boolean;
        handleProtocols?: (protocols: Set<string>, request: any) => string | false;
        clientTracking?: boolean;
        perMessageDeflate?: boolean;
        maxPayload?: number;
      }
  
      class Server extends EventEmitter {
        constructor(options?: ServerOptions, callback?: () => void);
        on(event: 'connection', listener: (socket: WebSocket) => void): this;
        on(event: 'error' | 'headers', listener: (data: any) => void): this;
        close(cb?: (err: Error) => void): void;
      }
    }
  
    export = WebSocket;
  }
  