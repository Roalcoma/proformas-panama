import { reporteGeneral, reporteVSFA, reporteVSBA, reporteVS } from "./querys/reporteGeneral";

export const querys = {
    getData: reporteGeneral,
    getDataVSFA: reporteVSFA,
    getDataVSBA: reporteVSBA,
    getDataVS: reporteVS,
    getDataByClient:`
        SELECT
            C.CODCLIENTE,
            C.NOMBRECLIENTE,
            C.DIRECCION1,
            C.NIF20,
            ISNULL(C.TELEFONO1, '') AS TELEFONO, -- AS para alias
            FORMAT(FV.FECHA, 'd', 'es-PA') AS FECHA, -- AS para alias
            FV.NUMSERIE AS NUMSERIE,
            FV.NUMFACTURA AS NUMFAC, -- AS para alias
            --ISNULL(FVCL.NCAJAS, 0) AS NCAJAS, -- AS para alias
            --ISNULL(FVCL.PNETO, 0) AS PNETO, -- AS para alias
            FVCL.VIADESPACHO,
            M.CODIGOISO AS MONEDA, -- AS para alias
            FV.TOTALBRUTO,
            FV.TOTDTOCOMERCIAL,
            FV.TOTALNETO,
            ISNULL(FVCL.TOTALCAJABULTO, 0) TOTALCAJABULTO,
            ISNULL(FVCL.PESONETO, CONCAT(0, ' KG')) PESONETO,
            ISNULL(FP.DESCRIPCION, 'CREDITO 30 DIAS USD') AS FORMAPAGO, -- AS para alias
            ISNULL(C.CODPAIS, '') AS CODPAIS, -- AS para alias
            ISNULL(C.PAIS, '') AS PAIS
        FROM
            FACTURASVENTA FV WITH(NOLOCK)
        INNER JOIN
            CLIENTES C WITH(NOLOCK) ON FV.CODCLIENTE = C.CODCLIENTE
        INNER JOIN
            FACTURASVENTACAMPOSLIBRES FVCL WITH(NOLOCK) ON FV.NUMSERIE = FVCL.NUMSERIE
                                                    AND FV.NUMFACTURA = FVCL.NUMFACTURA
                                                    AND FV.N = FVCL.N -- Revisa si 'FV.N = FVCL.N' es necesario para tu clave primaria
        INNER JOIN
            MONEDAS M WITH(NOLOCK) ON FV.CODMONEDA = M.CODMONEDA
        LEFT JOIN
            FPAGOCLIENTE FPC WITH(NOLOCK) ON C.CODCLIENTE = FPC.CODCLIENTE
                                        AND FPC.TIPO = 'Por Defecto'
        LEFT JOIN
            FORMASPAGO FP WITH(NOLOCK) ON FPC.CODFORMAPAGO = FP.CODFORMAPAGO
        WHERE
            FV.NUMSERIE = @NUMSERIEFAC -- Usando parámetros para evitar inyección SQL
            AND FV.NUMFACTURA BETWEEN @NUMFAC_INI AND @NUMFAC_FIN -- Usando parámetros para evitar inyección SQL
            AND ISNULL(CODPAIS, '') <> ''
            AND (CODPAIS LIKE '%PA%'
            OR CODPAIS LIKE '%AR%'
            OR CODPAIS LIKE '%CO%'
            OR CODPAIS LIKE '%CR%'
            OR CODPAIS LIKE '%CW%'
            OR CODPAIS LIKE '%EC%'
            OR CODPAIS LIKE '%GT%'
            OR CODPAIS LIKE '%PE%'
            OR CODPAIS LIKE '%PY%'
            OR CODPAIS LIKE '%SV%'
            OR CODPAIS LIKE '%UY%'
            OR CODPAIS LIKE '%VE%'
            OR CODPAIS LIKE '%DO%')
    `,
    getDataByClientVSFA: `
        SELECT
            C.CODCLIENTE,
            C.NOMBRECLIENTE,
            C.DIRECCION1,
            C.NIF20,
            ISNULL(C.TELEFONO1, '') AS TELEFONO, -- AS para alias
            FORMAT(FV.FECHA, 'dd/MM/yyyy') AS FECHA, -- AS para alias
            FV.NUMSERIE AS NUMSERIE,
            FV.NUMFACTURA AS NUMFAC, -- AS para alias
            ISNULL(FVCL.NCAJAS, 0) AS TOTALCAJABULTO, -- AS para alias
            ISNULL(FVCL.PNETO, 0) AS PESONETO, -- AS para alias
            FVCL.VIADESPACHO,
            M.CODIGOISO AS MONEDA, -- AS para alias
            FV.TOTALBRUTO,
            FV.TOTDTOCOMERCIAL,
            FV.TOTALNETO,
            --ISNULL(FVCL.TOTALCAJABULTO, 0) TOTALCAJABULTO,
            --ISNULL(FVCL.PESONETO, CONCAT(0, ' KG')) PESONETO,
            ISNULL(FP.DESCRIPCION, 'CREDITO 30 DIAS USD') AS FORMAPAGO, -- AS para alias
            ISNULL(C.CODPAIS, '') AS CODPAIS, -- AS para alias
            ISNULL(C.PAIS, '') AS PAIS
        FROM
            FACTURASVENTA FV WITH(NOLOCK)
        INNER JOIN
            CLIENTES C WITH(NOLOCK) ON FV.CODCLIENTE = C.CODCLIENTE
        INNER JOIN
            FACTURASVENTACAMPOSLIBRES FVCL WITH(NOLOCK) ON FV.NUMSERIE = FVCL.NUMSERIE
                                                    AND FV.NUMFACTURA = FVCL.NUMFACTURA
                                                    AND FV.N = FVCL.N -- Revisa si 'FV.N = FVCL.N' es necesario para tu clave primaria
        INNER JOIN
            MONEDAS M WITH(NOLOCK) ON FV.CODMONEDA = M.CODMONEDA
        LEFT JOIN
            FPAGOCLIENTE FPC WITH(NOLOCK) ON C.CODCLIENTE = FPC.CODCLIENTE
                                        AND FPC.TIPO = 'Por Defecto'
        LEFT JOIN
            FORMASPAGO FP WITH(NOLOCK) ON FPC.CODFORMAPAGO = FP.CODFORMAPAGO
        WHERE
            FV.NUMSERIE = @NUMSERIEFAC -- Usando parámetros para evitar inyección SQL
            AND FV.NUMFACTURA BETWEEN @NUMFAC_INI AND @NUMFAC_FIN -- Usando parámetros para evitar inyección SQL
            AND ISNULL(CODPAIS, '') <> ''
            AND (CODPAIS LIKE '%PA%'
            OR CODPAIS LIKE '%AR%'
            OR CODPAIS LIKE '%CO%'
            OR CODPAIS LIKE '%CR%'
            OR CODPAIS LIKE '%CW%'
            OR CODPAIS LIKE '%EC%'
            OR CODPAIS LIKE '%GT%'
            OR CODPAIS LIKE '%PE%'
            OR CODPAIS LIKE '%PY%'
            OR CODPAIS LIKE '%SV%'
            OR CODPAIS LIKE '%UY%'
            OR CODPAIS LIKE '%VE%'
            OR CODPAIS LIKE '%DO%')
    `,
    getDataByClientVSBA: `
        SELECT
            C.CODCLIENTE,
            C.NOMBRECLIENTE,
            C.DIRECCION1,
            C.NIF20,
            ISNULL(C.TELEFONO1, '') AS TELEFONO, -- AS para alias
            FORMAT(FV.FECHA, 'dd/MM/yyyy') AS FECHA, -- AS para alias
            FV.NUMSERIE AS NUMSERIE,
            FV.NUMFACTURA AS NUMFAC, -- AS para alias
            ISNULL(FVCL.N_CAJAS, 0) AS TOTALCAJABULTO, -- AS para alias
            ISNULL(FVCL.P_NETO, 0) AS PESONETO, -- AS para alias
            FVCL.VIA_DESPACHO VIADESPACHO,
            M.CODIGOISO AS MONEDA, -- AS para alias
            FV.TOTALBRUTO,
            FV.TOTDTOCOMERCIAL,
            FV.TOTALNETO,
            --ISNULL(FVCL.TOTALCAJABULTO, 0) TOTALCAJABULTO,
            --ISNULL(FVCL.PESONETO, CONCAT(0, ' KG')) PESONETO,
            ISNULL(FP.DESCRIPCION, 'CREDITO 30 DIAS USD') AS FORMAPAGO, -- AS para alias
            ISNULL(C.CODPAIS, '') AS CODPAIS, -- AS para alias
            ISNULL(C.PAIS, '') AS PAIS
        FROM
            FACTURASVENTA FV WITH(NOLOCK)
        INNER JOIN
            CLIENTES C WITH(NOLOCK) ON FV.CODCLIENTE = C.CODCLIENTE
        INNER JOIN
            FACTURASVENTACAMPOSLIBRES FVCL WITH(NOLOCK) ON FV.NUMSERIE = FVCL.NUMSERIE
                                                    AND FV.NUMFACTURA = FVCL.NUMFACTURA
                                                    AND FV.N = FVCL.N -- Revisa si 'FV.N = FVCL.N' es necesario para tu clave primaria
        INNER JOIN
            MONEDAS M WITH(NOLOCK) ON FV.CODMONEDA = M.CODMONEDA
        LEFT JOIN
            FPAGOCLIENTE FPC WITH(NOLOCK) ON C.CODCLIENTE = FPC.CODCLIENTE
                                        AND FPC.TIPO = 'Por Defecto'
        LEFT JOIN
            FORMASPAGO FP WITH(NOLOCK) ON FPC.CODFORMAPAGO = FP.CODFORMAPAGO
        WHERE
            FV.NUMSERIE = @NUMSERIEFAC -- Usando parámetros para evitar inyección SQL
            AND FV.NUMFACTURA BETWEEN @NUMFAC_INI AND @NUMFAC_FIN -- Usando parámetros para evitar inyección SQL
            AND ISNULL(CODPAIS, '') <> ''
            AND (CODPAIS LIKE '%PA%'
            OR CODPAIS LIKE '%AR%'
            OR CODPAIS LIKE '%CO%'
            OR CODPAIS LIKE '%CR%'
            OR CODPAIS LIKE '%CW%'
            OR CODPAIS LIKE '%EC%'
            OR CODPAIS LIKE '%GT%'
            OR CODPAIS LIKE '%PE%'
            OR CODPAIS LIKE '%PY%'
            OR CODPAIS LIKE '%SV%'
            OR CODPAIS LIKE '%UY%'
            OR CODPAIS LIKE '%VE%'
            OR CODPAIS LIKE '%DO%')
    `,
    getDataByClientVS: `
        SELECT
            C.CODCLIENTE,
            C.NOMBRECLIENTE,
            C.DIRECCION1,
            C.NIF20,
            ISNULL(C.TELEFONO1, '') AS TELEFONO,
            FORMAT(FV.FECHA, 'dd/MM/yyyy') AS FECHA,
            FV.NUMSERIE AS NUMSERIE,
            FV.NUMFACTURA AS NUMFAC,
            ISNULL(FVCL.N_CAJAS, 0) AS TOTALCAJABULTO,
            ISNULL(FVCL.P_NETO, 0) AS PESONETO,
            FVCL.VIA_DESPACHO AS VIADESPACHO,
            M.CODIGOISO AS MONEDA,
            FV.TOTALBRUTO,
            FV.TOTDTOCOMERCIAL,
            FV.TOTALNETO,
            ISNULL(FP.DESCRIPCION, 'CREDITO 30 DIAS USD') AS FORMAPAGO,
            ISNULL(C.CODPAIS, '') AS CODPAIS,
            ISNULL(C.PAIS, '') AS PAIS
        FROM
            FACTURASVENTA FV WITH(NOLOCK)
        INNER JOIN
            CLIENTES C WITH(NOLOCK) ON FV.CODCLIENTE = C.CODCLIENTE
        INNER JOIN
            FACTURASVENTACAMPOSLIBRES FVCL WITH(NOLOCK) ON FV.NUMSERIE = FVCL.NUMSERIE
                                                    AND FV.NUMFACTURA = FVCL.NUMFACTURA
                                                    AND FV.N = FVCL.N
        INNER JOIN
            MONEDAS M WITH(NOLOCK) ON FV.CODMONEDA = M.CODMONEDA
        LEFT JOIN
            FPAGOCLIENTE FPC WITH(NOLOCK) ON C.CODCLIENTE = FPC.CODCLIENTE
                                        AND FPC.TIPO = 'Por Defecto'
        LEFT JOIN
            FORMASPAGO FP WITH(NOLOCK) ON FPC.CODFORMAPAGO = FP.CODFORMAPAGO
        WHERE
            FV.NUMSERIE = @NUMSERIEFAC
            AND FV.NUMFACTURA BETWEEN @NUMFAC_INI AND @NUMFAC_FIN
            AND ISNULL(C.CODPAIS, '') <> ''
            AND (C.CODPAIS LIKE '%PA%'
            OR C.CODPAIS LIKE '%AR%'
            OR C.CODPAIS LIKE '%CO%'
            OR C.CODPAIS LIKE '%CR%'
            OR C.CODPAIS LIKE '%CW%'
            OR C.CODPAIS LIKE '%EC%'
            OR C.CODPAIS LIKE '%GT%'
            OR C.CODPAIS LIKE '%PE%'
            OR C.CODPAIS LIKE '%PY%'
            OR C.CODPAIS LIKE '%SV%'
            OR C.CODPAIS LIKE '%UY%'
            OR C.CODPAIS LIKE '%VE%'
            OR C.CODPAIS LIKE '%DO%')
    `

};
