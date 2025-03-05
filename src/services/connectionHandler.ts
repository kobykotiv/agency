import { DemoModeService } from './demoMode';

export class ConnectionHandler {
  private static instance: ConnectionHandler;
  private isDemoMode: boolean = false;
  private demoService: DemoModeService;

  private constructor() {
    this.demoService = DemoModeService.getInstance();
  }

  static getInstance(): ConnectionHandler {
    if (!ConnectionHandler.instance) {
      ConnectionHandler.instance = new ConnectionHandler();
    }
    return ConnectionHandler.instance;
  }

  async connect(): Promise<boolean> {
    try {
      // Attempt real connection
      // ...existing connection code...
      return true;
    } catch (error) {
      console.warn('Falling back to demo mode:', error);
      this.isDemoMode = true;
      return true;
    }
  }

  async sendMessage(message: string): Promise<string> {
    if (this.isDemoMode) {
      return this.demoService.handleChatMessage(message);
    }
    // ...existing message handling code...
  }

  isInDemoMode(): boolean {
    return this.isDemoMode;
  }
}
