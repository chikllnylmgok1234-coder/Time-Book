#!/bin/bash

# Time Book Admin Account Creation Script

echo "========================================"
echo "Time Book - Create Admin Account"
echo "========================================"

read -p "Enter admin email: " ADMIN_EMAIL
read -sp "Enter admin password: " ADMIN_PASSWORD
echo ""
read -p "Enter admin name: " ADMIN_NAME

node << 'EOF'
const mongoose = require('mongoose');
const argon2 = require('argon2');
const dotenv = require('dotenv');

dotenv.config();

const adminEmail = process.env.ADMIN_EMAIL || 'admin@timebook.app';
const adminName = process.env.ADMIN_NAME || 'Time Book Admin';
const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe123!';

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  try {
    const User = require('./models/User');
    
    const passwordHash = await argon2.hash(adminPassword, {
      type: argon2.argon2id,
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1
    });

    const admin = new User({
      phoneNumber: '+00-admin',
      username: 'admin',
      passwordHash,
      name: adminName,
      verified: true,
      role: 'admin'
    });

    await admin.save();
    
    console.log('\n✅ Admin account created successfully!');
    console.log('Email:', adminEmail);
    console.log('Name:', adminName);
    console.log('\n⚠️  Change the password after first login!');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error creating admin:', err.message);
    process.exit(1);
  }
}).catch(err => {
  console.error('❌ Database connection error:', err);
  process.exit(1);
});
EOF
