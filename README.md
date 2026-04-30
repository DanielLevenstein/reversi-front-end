# Reversi Front End: OpenClaw Case Study
This repo was generated completely by openClaw with the exception of this README.md file and the human-reversi.log file.

It calls the [reversi-game-engine](https://github.com/DanielLevenstein/reversi-game-engine.git) backend I wrote several months ago with the help of [Shaina Munoz](https://github.com/AvengerFreak) who helped me dockerize it.


## Instructions to run

checkout and run reversi-game-engine backend
```
git clone https://github.com/DanielLevenstein/reversi-game-engine.git
```
```
cp ./conf/application.conf.template ./conf/application.conf
docker build -t reversi-game-engine:latest .
docker run -p 9000:9000 reversi-game-engine:latest
```

checkout and run reversi-front-end
```
git clone https://github.com/DanielLevenstein/reversi-front-end.git
```
```
npm run dev
```

Open the shown local URL (usually `http://localhost:5173`).

Make sure the backend is running on `http://localhost:9000` (or change the URL in the UI).

## Features

- Create new game
- Render 8x8 board
- Highlight valid moves for current turn
- Click to play human moves
- Auto-play AI turns when `currentTurn === aiPlayer`
