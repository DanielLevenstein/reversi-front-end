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

## Code Quality Observations

### Methodology
Because of security concerns I ran this experiment on a separate browser login so openClaw wouldn't have access to my passwords and security keys. This worked for this project because it had a limited scope but it introduces a scalability problem for larger projects.

# Observations
- OpenClaw was able to generate the code for the front end application in a couple of hours which is faster than it would take most humans to do it.
- OpenClaw left all its test files in the root directory rather than putting them under src/test which isn't standard code practice. It is possible it intended to delete these files once the app was functioning.
- There are several bugs like the CORS access control policy issue where I had to ask it to fix the issue multiple times because OpenClaw declaired them fixed too early.
- The long response time between prompts made the development process frustrating. 
- I asked OpenClaw to document it's progress as it went when it stopped doing after a single log message.
- The total cost of the session came out to 4 cents which is a neglegable amount of money but I image cost would go up with project complexity.

## Features

- Create new game
- Render 8x8 board
- Highlight valid moves for current turn
- Click to play human moves
- Auto-play AI turns when `currentTurn === aiPlayer`
