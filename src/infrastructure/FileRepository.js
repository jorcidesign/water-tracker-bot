const fs = require('fs');
const path = require('path');

class FileRepository {
    constructor(filename) {
        this.filePath = path.join(__dirname, '../../', filename);
        this.ensureFileExists();
    }

    ensureFileExists() {
        if (!fs.existsSync(this.filePath)) {
            const initialData = { users: {}, dailyLogs: {} };
            fs.writeFileSync(this.filePath, JSON.stringify(initialData, null, 2));
        }
    }

    load() {
        try {
            const rawData = fs.readFileSync(this.filePath, 'utf8');
            const parsedData = JSON.parse(rawData);

            // PATRÓN DE DISEÑO: Defensive Copy / Default Values
            // Si parsedData.users no existe, asignamos {} por defecto
            return {
                users: parsedData.users || {},
                dailyLogs: parsedData.dailyLogs || {}
            };
        } catch (error) {
            // Si el archivo está vacío o el JSON es inválido, retornamos estructura limpia
            console.error('Error IO o JSON corrupto, reiniciando memoria:', error.message);
            return { users: {}, dailyLogs: {} };
        }
    }

    save(data) {
        fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
    }
}

module.exports = FileRepository;