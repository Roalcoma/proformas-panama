import { connectDb, closeDb, mssql } from '../database/database.conection';
import sql from 'mssql';
import { querys } from '../query/generador.query';
import { encriptacion } from '../utils/encriptacion';

const config = (db: any) => {

    const configDb: sql.config = {
        user: process.env.DB_USER,
        password: encriptacion.desEncriptar(process.env.DB_PASSWORD as string),
        server: process.env.DB_SERVER || 'localhost', // Puedes poner un valor por defecto si DB_SERVER no está en .env
        port: parseInt(process.env.DB_PORT || '1433', 10), // Convertir a número
        database: db, // Cambia esto al nombre de tu base de datos
        options: {
            encrypt: process.env.DB_ENCRYPT === 'true', // Usar SSL/TLS, true para Azure SQL Database
            trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true' // Cambiar a true para desarrollo local si usas certificados auto-firmados
        }
    }

    return configDb
};


export class GeneradorModel {
    static async getData(numSerie: string, numFac: number, tipoExcel: string, db: string): Promise<any[]> {
        const pool = await connectDb(config(db));

        console.log(db)

        console.log(`Obteniendo datos para la serie: ${numSerie}, factura: ${numFac}, tipo: ${tipoExcel}`);
        if (!numSerie || !numFac || !tipoExcel) {
            throw new Error('Número de serie, número de factura y tipo de Excel son requeridos');
        }

        const query = () => {
            if(db === 'BBW_NEW'){
                return querys.getData
            } else if(db === 'VSFC_PMA'){
                return querys.getDataVSFA
            } else if(db === 'VSBA') {
                return querys.getDataVSBA
            } else if(db === 'VS') {
                return querys.getDataVS
            } else {
                return querys.getData
            }
        }
        
        const result = await pool.request()
            .input('NUMSERIEFAC', mssql.VarChar, numSerie)
            .input('NUMFAC', mssql.Int, numFac)
            .query(query());

        console.log(`Datos obtenidos: ${result.recordset} registros`);
        await closeDb();
        return result.recordset;
    }

    static async getDataByClient(numSerie: string, numFacturaIni: number, numFacturaFin: number, db: string): Promise<any[]> {
        const pool = await connectDb(config(db));

        const query = () => {
            if(db === 'BBW_NEW'){
                return querys.getDataByClient
            } else if(db === 'VSFC_PMA'){
                return querys.getDataByClientVSFA
            } else if(db === 'VSBA') {
                return querys.getDataByClientVSBA
            } else if(db === 'VS') {
                return querys.getDataByClientVS
            } else {
                return querys.getDataByClient
            }
        }
        const result = await pool.request()
            .input('NUMSERIEFAC', mssql.VarChar, numSerie)
            .input('NUMFAC_INI', mssql.Int, numFacturaIni)
            .input('NUMFAC_FIN', mssql.Int, numFacturaFin)
            .query(query());
        await closeDb();
        return result.recordset;
    }
}