// hash-tool.js
// Usage: node hash-tool.js <password>
import bcrypt from 'bcrypt';

const password = process.argv[2];
if (!password) {
    console.error('Usage: node hash-tool.js <password>');
    process.exit(1);
}

const saltRounds = 10;
bcrypt.hash(password, saltRounds, function(err, hash) {
    if (err) {
        console.error('Error hashing password:', err);
        process.exit(1);
    }
    console.log('Hash for', password, ':', hash);
});
