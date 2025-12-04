class DateUtils {
    static getTodayKey() {
        // Retorna formato YYYY-MM-DD usando la zona horaria local
        // Importante para que el cambio de día sea a las 00:00 de TU país
        const date = new Date();
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - (offset * 60 * 1000));
        return localDate.toISOString().split('T')[0];
    }
}
module.exports = DateUtils;