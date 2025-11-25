declare module 'node-nlp' {
  export class NlpManager {
    constructor(options?: any);
    addDocument(lang: string, utterance: string, intent: string): void;
    addAnswer(lang: string, intent: string, answer: string): void;
    train(): Promise<void>;
    process(lang: string, utterance: string): Promise<any>;
    save(fileName?: string): void;
    load(fileName: string): void;
  }
}