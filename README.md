# Reversi Front End: OpenClaw Case Study
This repo was generated completely by openClaw with the exception of this README.md file and the human-reversi.log file.

It calls the [reversi-game-engine](https://github.com/DanielLevenstein/reversi-front-end.git) backend I wrote several months ago with the help of [Shaina Munoz](https://github.com/AvengerFreak) who helped me dockerize it.


## Instructions to run

checkout and run reversi-game-engine backend
```
git clone https://github.com/DanielLevenstein/reversi-game-engine.git
docker build -t reversi-game-engine:latest .
docker run -p 9000:9000 reversi-game-engine:latest
```

checkout and run reversi-front-end
```
git clone https://github.com/DanielLevenstein/reversi-front-end.git
```

