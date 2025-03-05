import { LocalStorage } from '../utils/localStorage';

export class DemoModeService {
  private storage: LocalStorage;
  private static instance: DemoModeService;

  private constructor() {
    this.storage = new LocalStorage('crewai-demo');
  }

  static getInstance(): DemoModeService {
    if (!DemoModeService.instance) {
      DemoModeService.instance = new DemoModeService();
    }
    return DemoModeService.instance;
  }

  async handleChatMessage(message: string): Promise<string> {
    return `Demo Mode: ${message}`;
  }

  async createCrew(name: string, config: any): Promise<any> {
    const crews = this.storage.get('crews') || [];
    const newCrew = { id: Date.now(), name, config };
    crews.push(newCrew);
    this.storage.set('crews', crews);
    return newCrew;
  }

  exportCrew(name: string): string {
    const crews = this.storage.get('crews') || [];
    const crew = crews.find((c: any) => c.name === name);
    return crew ? JSON.stringify(crew, null, 2) : '';
  }
}
