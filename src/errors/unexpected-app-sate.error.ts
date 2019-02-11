export class UnexpectedAppSateError extends Error {
    constructor() {
        super(`Unexpected app state`);
        this.name = 'UnexpectedAppSate';
    }
}
