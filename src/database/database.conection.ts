import sql from 'mssql';
import 'dotenv/config'; // Asegúrate de que dotenv esté instalado y configurado

export const mssql = sql; // Alias para mantener compatibilidad con el código existente

let pool: sql.ConnectionPool | null = null;

export async function connectDb(config: sql.config): Promise<sql.ConnectionPool> {
    try {
        if (pool && pool.connected) {
            console.log('Usando pool de conexión existente.');
            return pool;
        }

        pool = await sql.connect(config);
        console.log('Conexión a SQL Server establecida correctamente.');
        return pool;
    } catch (err: any) {
        console.error('Error al conectar a SQL Server:', err);
        // Podrías lanzar el error o manejarlo de otra manera
        throw err;
    }
}

export async function closeDb(): Promise<void> {
    if (pool && pool.connected) {
        await pool.close();
        console.log('Conexión a SQL Server cerrada.');
    }
}