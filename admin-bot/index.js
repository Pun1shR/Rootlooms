require('dotenv').config();
const { Telegraf } = require('telegraf');
const { createClient } = require('@supabase/supabase-js');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const ADMIN_ID = process.env.ADMIN_TELEGRAM_ID;

// Simple in-memory state store to track when we are waiting for details after a photo
const adminState = new Map();

bot.use((ctx, next) => {
    // Basic Security: Only allow the admin to use this bot
    if (ctx.from && ctx.from.id.toString() !== ADMIN_ID) {
        // If it's a new unknown user trying to message the bot, we can optionally log their ID so the admin knows their own ID.
        console.log(`Unauthorized access attempt from User ID: ${ctx.from.id}`);
        return; // Ignore messages from unauthorized users
    }
    return next();
});

bot.start((ctx) => {
    ctx.reply('Welcome to the Saree Admin Bot! Send me a photo of a saree to get started.');
});

bot.on('photo', (ctx) => {
    // Get the highest resolution photo
    const photo = ctx.message.photo[ctx.message.photo.length - 1];
    
    adminState.set(ctx.from.id, {
        step: 'awaiting_details',
        fileId: photo.file_id
    });
    
    ctx.reply('Photo received! Please send the saree details in this exact format:\n\nName, Category, Price, Stock\n\nExample: Red Banarasi, Silk, 5000, 10');
});

bot.on('text', async (ctx) => {
    const state = adminState.get(ctx.from.id);
    
    // If we're not waiting for details, ignore or send help text
    if (!state || state.step !== 'awaiting_details') {
        return ctx.reply('Please send a photo first to add a new saree.');
    }
    
    const text = ctx.message.text;
    const parts = text.split(',').map(p => p.trim());
    
    if (parts.length !== 4) {
        return ctx.reply('Invalid format. Please provide exactly 4 comma-separated values:\nName, Category, Price, Stock');
    }
    
    const [name, categoryName, priceStr, stockStr] = parts;
    const price = parseFloat(priceStr);
    const stock = parseInt(stockStr, 10);
    
    if (isNaN(price) || isNaN(stock)) {
        return ctx.reply('Price and Stock must be valid numbers.');
    }
    
    try {
        ctx.reply('Processing your request... This may take a few seconds.');
        
        // 1. Get the image file from Telegram
        const fileLink = await ctx.telegram.getFileLink(state.fileId);
        
        // 2. Download the image
        const response = await fetch(fileLink.href);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        // 3. Upload to Supabase Storage
        const filename = `sarees/${Date.now()}.jpg`;
        const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from('saree_images')
            .upload(filename, buffer, {
                contentType: 'image/jpeg',
                upsert: true
            });
            
        if (uploadError) throw new Error(`Upload Error: ${uploadError.message}`);
        
        // 4. Get public URL for the uploaded image
        const { data: { publicUrl } } = supabase
            .storage
            .from('saree_images')
            .getPublicUrl(filename);
            
        // 5. Handle the Category (Find or Create)
        let categoryId;
        const { data: existingCategory } = await supabase
            .from('categories')
            .select('id')
            .ilike('name', categoryName)
            .maybeSingle();
            
        if (existingCategory) {
            categoryId = existingCategory.id;
        } else {
            const { data: newCategory, error: categoryError } = await supabase
                .from('categories')
                .insert([{ name: categoryName }])
                .select()
                .single();
                
            if (categoryError) throw new Error(`Category Error: ${categoryError.message}`);
            categoryId = newCategory.id;
        }
        
        // 6. Insert the Saree record
        const { error: insertError } = await supabase
            .from('sarees')
            .insert([{
                name: name,
                category_id: categoryId,
                price: price,
                stock: stock,
                image_url: publicUrl
            }]);
            
        if (insertError) throw new Error(`Insert Error: ${insertError.message}`);
        
        // Success!
        adminState.delete(ctx.from.id); // clear state
        ctx.reply(`✅ Successfully added "${name}" to the inventory!\n\nCategory: ${categoryName}\nPrice: ₹${price}\nStock: ${stock}`);
        
    } catch (error) {
        console.error(error);
        ctx.reply(`❌ An error occurred: ${error.message}\n\nPlease try again by sending the photo.`);
        adminState.delete(ctx.from.id);
    }
});

bot.launch().then(() => {
    console.log('Bot is running and listening for messages!');
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
