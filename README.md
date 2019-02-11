# Bloomon cli app    

## Docker

### Build Docker image:

```
$ docker build -t <your username>/bloomon-cli-app .  
```

### Run Docker image (interactive mode) / Run bloomon cli app:

```
$ docker run -it <your username>/bloomon-cli-app
```

## Project folders and files structure:

- `src/index.ts` is the entry point to the cli app
- `src/models/bloomon-app.ts` is the app itself and mostly takes care of handling the app state
- `src/interfaces` and `src/errors` folders contains different interfaces and custom errors
- `src/code-parsers` folder contains input line validators/parsers
- `src/bouquet-solvers` folder contains algorithms to build bouquets
- `tests` contains some tests  

## TODOs

- More tests to try to reach a good amount of code coverage. 
- Implement a better algorithm to solve bouquets, probably some kind of linear equations solver with constraints (maybe a simplex implementation).  
