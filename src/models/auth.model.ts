import sql from 'mssql';
import { connectDb, closeDb, mssql } from '../database/database.conection';
import { encriptacion } from '../utils/encriptacion';

const config: sql.config = {
    user: process.env.DB_USER,
    password: encriptacion.desEncriptar(process.env.DB_PASSWORD as string),
    server: process.env.DB_SERVER || 'localhost', // Puedes poner un valor por defecto si DB_SERVER no está en .env
    port: parseInt(process.env.DB_PORT || '1433', 10), // Convertir a número
    database: 'GENERAL', // Cambia esto al nombre de tu base de datos
    options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true'
    }
};

export class AuthModel {
    static async login(password: string): Promise<any> {
        try {
            const pool = await connectDb(config);
            const request = pool.request();
            request.input('NEWPASS', mssql.VarChar, encriptacion.encriptar(password));
            const result = await request.query(`SELECT U.CODUSUARIO, U.USUARIO, SUBSTRING(EM.PATHBD, CHARINDEX(':', EM.PATHBD) + 1, LEN(EM.PATHBD)) DB FROM USUARIOS U
                                                INNER JOIN EMPRESASUSUARIO EMU ON EMU.CODUSUARIO = U.CODUSUARIO
                                                INNER JOIN EMPRESAS EM ON EM.CODEMPRESA = EMU.CODEMPRESA
                                                WHERE NEWPASS = @NEWPASS`);
            return result.recordset;
        } catch (error) {
            console.error('Error en la consulta de autenticación:', error);
            throw error;
        } finally {
            await closeDb();
        }
    }
}