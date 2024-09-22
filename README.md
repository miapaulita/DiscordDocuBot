Discord PDF Preview Bot
Overview
This bot allows users to upload PDF files in Discord, generates a preview image from the first page of the PDF, and sends an embedded message with file details and the preview image. It leverages Discord.js along with other libraries to enhance PDF sharing in Discord channels.

Features
Listens for PDF attachments in messages.
Generates a preview image from the first page of the PDF.
Sends an embedded message with PDF details and the preview image.
Graceful error handling.

Prerequisites
Node.js (v16 or later)
Discord.js library
pdf-lib library
canvas library
node-fetch library

Installation
Clone the repository:

bash
Copy code
git clone <repository-url>
cd <repository-directory>
Install the required packages:

bash
Copy code
npm install discord.js pdf-lib canvas node-fetch
Install Nodemon (optional, but recommended for development):

bash
Copy code
npm install --save-dev nodemon
Create a config.json file in the root directory with the following content:

json
Copy code
{
    "token": "YOUR_DISCORD_BOT_TOKEN"
}
Replace YOUR_DISCORD_BOT_TOKEN with your actual Discord bot token.

Usage
Start the bot using Nodemon for automatic restarts during development:

bash
Copy code
npx nodemon <your-bot-file>.js
Alternatively, you can start the bot with Node:

bash
Copy code
node <your-bot-file>.js
Upload a PDF file in any Discord channel where the bot has been added. The bot will respond with a preview and file details.

Code Explanation
Client Setup: The bot is initialized with intents to read messages and attachments.
PDF Handling: On PDF upload, the bot fetches the file, generates a preview using pdf-lib and canvas, and sends an embed with the file information.
Error Handling: If an error occurs while generating the preview, the bot logs the error and notifies the user.
Notes
Ensure the bot has the necessary permissions to read messages and send embeds in the server.
The preview image is generated from the first page of the PDF and temporarily stored in the filesystem.
Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

License
This project is licensed under the MIT License. See the LICENSE file for details.# DiscordDocuBot
# DiscordDocuBot
# DiscordDocuBot
