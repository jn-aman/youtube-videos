# youtube-videos

Perform the follow task:-

1. Run `cp .env.example .env`
2. Fill Youtube API key in the .env file
3. Run `docker-compose up -d`
4. go to `http://localhost:3000/api-docs/` to play with the API (swagger documentation)

# Note:

1. pm2 runs in background (every 1 min) to get the data and store it in database.
2. Before making the API call, latest publishTime is fetched from database and then videos are fetched after that time.
