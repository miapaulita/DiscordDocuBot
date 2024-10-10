import { Client, GatewayIntentBits, EmbedBuilder } from 'discord.js'; // Import necessary classes and functions from Discord.js
import fs from 'fs'; // Import the filesystem module to read files
import { PDFDocument } from 'pdf-lib'; // Import PDFDocument from pdf-lib to handle PDF files
import { createCanvas } from 'canvas'; // Import createCanvas from canvas to draw images
import fetch from 'node-fetch'; // Import fetch to make network requests
import pkg from 'pdfjs-dist/build/pdf.js'; // Import the default export
const { getDocument } = pkg; // Destructure getDocument from the imported package

const rawData = fs.readFileSync(new URL('./config.json', import.meta.url)); // Read the contents of the config.json file synchronously
const { token } = JSON.parse(rawData); // Parse the JSON data to extract the token

const client = new Client({ // Create a new Discord client instance with specific intents
    intents: [
        GatewayIntentBits.Guilds, // Allows the bot to see guilds (servers)
        GatewayIntentBits.GuildMessages, // Allows the bot to see messages in guilds
        GatewayIntentBits.MessageContent // Allows the bot to read message content
    ]
});

client.once('ready', () => { // Set an event listener for when the bot is ready
    console.log('Bot is online!'); // Log a message when the bot is ready
});

async function generatePdfPreview(url) { // Define an asynchronous function to generate a PDF preview
    try {
        const loadingTask = getDocument(url);
        const pdfDoc = await loadingTask.promise; // Load the PDF documen
        console.log('PDF loaded:', pdfDoc); // Log the PDF document object
        const page = await pdfDoc.getPage(1); // Get the first page (1-based index)
        
        const viewport = page.getViewport({ scale: 2.0 }); // Adjust scale for better resolution
        const { width, height } = viewport; // Get the size (width and height) of the page

        const canvas = createCanvas(width, height); // Create a canvas to draw on
        const context = canvas.getContext('2d');

        const renderContext = { // Prepare the rendering context
            canvasContext: context,
            viewport: viewport,
        };
        await page.render(renderContext).promise;
        return canvas.toBuffer(); // Return the canvas content as a buffer (image)

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
                        .setDescription(`**${attachment.name}** was uploaded by **${message.author.globalName}**`) // Set the description
                        .setColor(0x00AE86) // Set the embed color
                        .addFields(
                            { name: 'File Name', value: attachment.name }, // Add the file name field
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