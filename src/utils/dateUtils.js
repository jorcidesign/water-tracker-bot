class DateUtils {
    static getTodayKey() {
        // Usamos Intl.DateTimeFormat para forzar la hora de Perú.
        // El locale 'en-CA' (Canadá) es un truco de ingenieros porque 
        // su formato de fecha estándar ya es YYYY-MM-DD (ISO 8601).
        
        const formatter = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'America/Lima', // <--- AQUÍ ESTÁ LA MAGIA
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });

        return formatter.format(new Date()); 
        // Esto retornará siempre la fecha correcta en Lima, 
        // aunque el servidor esté en Londres.
    }
}

module.exports = DateUtils;
