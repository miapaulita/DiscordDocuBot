// Import necessary classes and functions from Discord.js
import { Client, GatewayIntentBits, EmbedBuilder } from 'discord.js'; 
// Import the filesystem module to read files
import fs from 'fs'; 
// Import PDFDocument from pdf-lib to handle PDF files
import { PDFDocument } from 'pdf-lib'; 
// Import createCanvas from canvas to draw images
import { createCanvas } from 'canvas'; 
// Import fetch to make network requests
import fetch from 'node-fetch'; 

// Read the contents of the config.json file synchronously
const rawData = fs.readFileSync(new URL('./config.json', import.meta.url)); 
// Parse the JSON data to extract the token
const { token } = JSON.parse(rawData); 

// Create a new Discord client instance with specific intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, // Allows the bot to see guilds (servers)
        GatewayIntentBits.GuildMessages, // Allows the bot to see messages in guilds
        GatewayIntentBits.MessageContent // Allows the bot to read message content
    ]
});

// Set an event listener for when the bot is ready
client.once('ready', () => {
    console.log('Bot is online!'); // Log a message when the bot is ready
});

// Define an asynchronous function to generate a PDF preview
async function generatePdfPreview(url) {
    try {
        // Fetch the PDF file from the provided URL
        const response = await fetch(url);
        // Convert the response to an ArrayBuffer
        const pdfBuffer = await response.arrayBuffer(); 
        // Load the PDF document from the buffer
        const pdfDoc = await PDFDocument.load(pdfBuffer); 
        // Get the first page of the PDF
        const page = pdfDoc.getPage(0); 
        // Get the size (width and height) of the page
        const { width, height } = page.getSize(); 
        // Create a canvas to draw on
        const canvas = createCanvas(width, height); 
        // Get the drawing context of the canvas
        const context = canvas.getContext('2d'); 
        // Set the background color
        context.fillStyle = 'lightgray'; 
        // Fill the entire canvas with the background color
        context.fillRect(0, 0, width, height); 
        // Set the font style for text
        context.font = '30px Arial'; 
        // Set the text color
        context.fillStyle = 'black'; 
        // Draw placeholder text on the canvas
        context.fillText('PDF Preview Placeholder', 50, 50); 
        // Return the canvas content as a buffer (image)
        return canvas.toBuffer(); 
    } catch (error) {
        // Log any errors that occur
        console.error('Error generating PDF preview:', error); 
        return null; // Return null if an error occurs
    }
}

// Set an event listener for new messages in the guild
client.on('messageCreate', async (message) => {
    // Ignore messages from bots
    if (message.author.bot) return; 
    // Check if there are attachments in the message
    if (message.attachments.size > 0) {
        // Loop through each attachment
        message.attachments.forEach(async (attachment) => {
            // Check if the attachment is a PDF
            if (attachment.contentType === 'application/pdf') {
                // Generate a preview image for the PDF
                const previewImage = await generatePdfPreview(attachment.url); 
                if (previewImage) {
                    // Specify the path to save the preview image
                    const previewPath = './pdf_preview.png'; 
                    // Write the preview image to the file system
                    fs.writeFileSync(previewPath, previewImage); 
                    // Create an embed message with PDF details
                    const embed = new EmbedBuilder()
                        .setTitle('📄 PDF File Uploaded') // Set the title of the embed
                        .setDescription(`**${attachment.name}** was uploaded by **${message.author.username}**`) // Set the description
                        .setColor(0x00AE86) // Set the embed color
                        .addFields(
                            { name: 'File Name', value: attachment.name }, // Add the file name field
                            { name: 'File Size', value: `${(attachment.size / 1024).toFixed(2)} KB` }, // Add the file size field
                            { name: 'Download Link', value: `[Click here to download the file](${attachment.url})` } // Add a download link field
                        )
                        .setImage('attachment://pdf_preview.png') // Set the preview image
                        .setTimestamp(); // Add a timestamp
                    // Send the embed message along with the preview image
                    await message.channel.send({
                        embeds: [embed],
                        files: [{ attachment: previewPath, name: 'pdf_preview.png' }]
                    });
                    // Delete the preview image from the file system
                    fs.unlinkSync(previewPath); 
                } else {
                    // Send a message if the preview couldn't be generated
                    message.channel.send('Could not generate a preview for the PDF.'); 
                }
            }
        });
    }
});

// Log in to Discord using the token
client.login(token); 
