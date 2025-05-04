// ------------------------------------------------------------------------------------
// Antipattern: Improbability;
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
// Resolution: Complex Error Handling
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