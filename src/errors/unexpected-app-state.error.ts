export class UnexpectedAppStateError extends Error {
    constructor() {
        super(`Unexpected app state`);
        this.name = 'UnexpectedAppSate';
    }
}
