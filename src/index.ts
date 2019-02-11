#!/usr/bin/env node

const readline = require('readline');
import {InputProcessor} from "./interfaces/input-processor.interface";
import {BloomonApp} from "./models/bloomon-app";

const bloomonApp: InputProcessor = new BloomonApp();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

rl.on('line', (line) => {
    const result = bloomonApp.processInput(line);
    null !== result && console.log(result);
});
