// MongoDB Atlas Connection Test
const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });

const MONGODB_URI = process.env.MONGODB_URI;

console.log('🔌 Testing MongoDB Atlas Connection...\n');

async function testConnection() {
    try {
        console.log('📡 Connecting to MongoDB Atlas...');
        console.log('🔗 URI:', MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));
        
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('✅ Successfully connected to MongoDB Atlas!\n');
        
        // Test database operations
        console.log('🧪 Testing database operations...');
        
        // Get database info
        const db = mongoose.connection.db;
        const admin = db.admin();
        const info = await admin.serverStatus();
        
        console.log('📊 Database Info:');
        console.log(`   • Host: ${info.host}`);
        console.log(`   • Version: ${info.version}`);
        console.log(`   • Uptime: ${Math.floor(info.uptime)} seconds`);
        console.log(`   • Database: ${db.databaseName}`);
        
        // Test collections access
        const collections = await db.listCollections().toArray();
        console.log(`   • Collections: ${collections.length > 0 ? collections.map(c => c.name).join(', ') : 'None (new database)'}`);
        
        console.log('\n✅ MongoDB Atlas connection test PASSED!');
        console.log('🚀 Your database is ready for Trek Tribe deployment!');
        
    } catch (error) {
        console.error('❌ MongoDB Atlas connection FAILED!');
        console.error('Error:', error.message);
        
        if (error.message.includes('authentication failed')) {
            console.log('\n💡 Troubleshooting Tips:');
            console.log('   • Check your username and password in the connection string');
            console.log('   • Ensure your MongoDB Atlas user has proper permissions');
            console.log('   • Verify your cluster is running');
        } else if (error.message.includes('network')) {
            console.log('\n💡 Troubleshooting Tips:');
            console.log('   • Check your internet connection');
            console.log('   • Verify MongoDB Atlas cluster is accessible');
            console.log('   • Check if your IP is whitelisted in MongoDB Atlas');
        }
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from MongoDB');
    }
}

testConnection();
