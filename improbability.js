// Antipattern: Improbability;
// ------------------------------------------------------------------------------------
// Assumption: File always exists;

{
    fs.readFile('./filename.ext', 'utf8', (err, data) => {
        // Мы предполагаем, что файл всегда есть.
        // Первым аргументом может приходить ошибка, которую мы не обрабатываем.
        const found = data.includes('substring');
        // Есть файла нет, то data = undefined, .includes не вызывается и код падает.
        console.dir({found});
    })
}
// ------------------------------------------------------------------------------------
// Resolution: Basic Error Handling;
{
    fs.readFile('./filename.ext', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return; // Выходим из ф-ции, если случилась ошибка.
        }
        const found = data.includes('substring');
        console.dir({ found });
    });
}
// ------------------------------------------------------------------------------------
// Resolution: Complex Error Handling;
// (E.g. Handle error using Promises with async/await and try-catch);
{
    const fsPromises = require('fs').promises;
    async function checkFile() {
        try {
            const data = await fsPromises.readFile('./filename.ext', 'utf8');
            const found = data.includes('substring');
            console.dir({found});
        } catch (err) {
            if (err.code === 'ENOENT') {
                console.error('File not found.');
            } else {
                console.error('Error reading file:', err);
            }
        }
    }
    checkFile();
}
// ------------------------------------------------------------------------------------
// Assumption: .json format, field 'port' exists and type is 'number';
{
    fs.readFile('./config.js', 'utf8', (err, data) => {
        // Мы предполагаем, что файл всегда есть.
        // Мы предполагаем, что файл в json формате и там обязтаельно есть объект, у которого есть поле 'port' и его тип 'number'.
        // Первым аргументом может приходить ошибка, которую мы не обрабатываем.
        const config = JSON.parse(data);
        // Вызываем JSON.parse(data) - который упадёт с ошибкой, потому что мы ожидаем файл .json, а в аргументах файл .js.
        const { port } = config;
        // Можно дополнительно сделать parseInt(), вдруг кто-то записал в поле port строку.
        console.dir({ port } );
    })
}
// ------------------------------------------------------------------------------------
// Resolution: Basic Error Handling;
{
    fs.readFile('./config.js', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }
        let config;
        try {
            config = JSON.parse(data);
        } catch (parseErr) {
            console.error('Error parsing JSON:', parseErr);
            return;
        }
        const { port } = config;
        const portNumber = typeof port === 'number' ? port : parseInt(port, 10);
        console.dir({ port: portNumber });
    });
}
// ------------------------------------------------------------------------------------
// Resolution: Complex Error Handling;
// (E.g. Handle error using Promises with async/await and try-catch);
{
    const fsPromises = require('fs').promises;
    async function loadConfig() {
        try {
            const data = await fsPromises.readFile('./config.js', 'utf8');
            const config = JSON.parse(data);
            if (!config.hasOwnProperty('port')) {
                console.error('Configuration missing "port" field.');
                return;
            }
            const { port } = config;
            const portNumber = typeof port === 'number' ? port : parseInt(port, 10);
            if (isNaN(portNumber)) {
                console.error('Invalid port value.');
                return;
            }
            console.dir({ port: portNumber });
        } catch (err) {
            if (err.code === 'ENOENT') {
                console.error('File not found.');
            } else if (err instanceof SyntaxError) {
                console.error('Error parsing JSON:', err);
            } else {
                console.error('Error reading file:', err);
            }
        }
    }
    loadConfig();
}
// ------------------------------------------------------------------------------------
