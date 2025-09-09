


const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const prompt = (inquirer.prompt ? inquirer.prompt : inquirer.default.prompt);

const DEFAULTS = {
    DB_HOST: '127.0.0.1',
    DB_USER: 'root',
    DB_PASSWORD: 'root',
    DB_DATABASE: 'sakila',
    DB_PORT: '3306',
    LOG_TO_FILE: false
};

async function main() {
    try {
        const answers = await prompt([
            { type: 'input', name: 'DB_HOST', message: 'MySQL Host:', default: DEFAULTS.DB_HOST },
            { type: 'input', name: 'DB_USER', message: 'MySQL User:', default: DEFAULTS.DB_USER },
            { type: 'password', name: 'DB_PASSWORD', message: 'MySQL Password:', default: DEFAULTS.DB_PASSWORD, mask: '*' },
            { type: 'input', name: 'DB_DATABASE', message: 'MySQL Database:', default: DEFAULTS.DB_DATABASE },
            {
                type: 'list',
                name: 'DB_PORT_CHOICE',
                message: 'MySQL Port:',
                choices: [
                    { name: '32768 (remote)', value: '32768' },
                    { name: '3306 (default MySQL)', value: '3306' },
                    { name: 'Custom', value: 'custom' }
                ],
                default: DEFAULTS.DB_PORT === '32768' ? 0 : (DEFAULTS.DB_PORT === '3306' ? 1 : 2)
            },
            {
                type: 'input',
                name: 'DB_PORT',
                message: 'Enter custom MySQL port:',
                when: (answers) => answers.DB_PORT_CHOICE === 'custom',
                validate: input => !isNaN(parseInt(input, 10)) && parseInt(input, 10) > 0 ? true : 'Please enter a valid port number',
                default: DEFAULTS.DB_PORT
            },
            { type: 'confirm', name: 'LOG_TO_FILE', message: 'Save logfiles to disk?', default: DEFAULTS.LOG_TO_FILE }
        ]);
        const finalPort = answers.DB_PORT_CHOICE === 'custom' ? answers.DB_PORT : answers.DB_PORT_CHOICE;

        // Write .env
        const envContent = `DB_HOST=${answers.DB_HOST}\nDB_USER=${answers.DB_USER}\nDB_PASSWORD=${answers.DB_PASSWORD}\nDB_DATABASE=${answers.DB_DATABASE}\nDB_PORT=${finalPort}\n`;
        fs.writeFileSync(path.resolve(process.cwd(), '.env'), envContent);
        console.log('.env file created');

        // Write settings.json
        const settings = { logToFile: answers.LOG_TO_FILE };
        fs.writeFileSync(path.resolve(process.cwd(), 'settings.json'), JSON.stringify(settings, null, 2));
        console.log('settings.json file created');
    } catch (err) {
        console.error('Error during setup:', err);
        process.exit(1);
    }
}

main();