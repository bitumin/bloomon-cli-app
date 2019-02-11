export interface InputProcessor {
    processInput(newInputLine: string): string | null;
}
