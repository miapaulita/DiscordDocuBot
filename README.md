# DiscordDocuBot

## Overview
This little bot handles all .pdf files sent on discord and makes them easy to preview without having to download! It generates a preview image from the first page of the PDF, and sends an embedded message with file details. It leverages **Discord.js** along with other libraries to enhance PDF sharing in Discord channels.

## Features
- Listens for PDF attachments in messages.
- Generates a preview image from the first page of the PDF.
- Sends an embedded message with PDF details and the preview image.
- Graceful error handling.

## Prerequisites
- **Node.js** (v16 or later)
- **Discord.js** library
- **pdf-lib** library
- **canvas** library
- **node-fetch** library

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd <repository-directory>

2. **Install the required packages:**
    npm install discord.js pdf-lib canvas node-fetch
    Install Nodemon (optional, but recommended for development):

   ```bash
    npm install --save-dev nodemon
    ```

3. **Enter your Bot Token:**
   Create a config.json file in the root directory with the following content.
   Replace YOUR_DISCORD_BOT_TOKEN with your actual Discord bot token.
   
    ```json
    {
        "token": "YOUR_DISCORD_BOT_TOKEN"
    }
    ```

 4. **Setup Nodeman:** Start the bot using Nodemon for automatic restarts during development:

    ```bash
    npx nodemon <your-bot-file>.js

5. Alternatively, you can start the bot with Node and without Nodeman:
       
        node <your-bot-file>.js
    
6. **TEST:** Upload a PDF file in any Discord channel where the bot has been added. The bot will respond with a preview and file details.

## Code Explanation
- Client Setup: The bot is initialized with intents to read messages and attachments.
- PDF Handling: On PDF upload, the bot fetches the file, generates a preview using pdf-lib and canvas, and sends an embed with the file information.
- Error Handling: If an error occurs while generating the preview, the bot logs the error and notifies the user.

## Notes
- Ensure the bot has the necessary permissions to read messages and send embeds in the server.
- The preview image is generated from the first page of the PDF and temporarily stored in the filesystem.

## Contributing
- Contributions are welcome! Please fork the repository and submit a pull request.

# DiscordDocuBot
