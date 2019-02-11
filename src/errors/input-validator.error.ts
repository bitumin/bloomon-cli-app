export class InputValidationError extends Error {
    constructor(message: string) {
        super(`Input validation error: ${message}`);
        this.name = 'InputValidationError';
    }
}
