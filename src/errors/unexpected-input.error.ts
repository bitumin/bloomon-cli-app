export class UnexpectedInputError extends Error {
    constructor(message) {
        super(`Unexpected input: ${message}`);
        this.name = 'UnexpectedInput';
    }
}
