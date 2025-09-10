import { facturasVentaOtrosACC } from "./querys/facturasVentaOtrosACC";
import { facturasVentaColombia } from "./querys/facturasDeVentasColombia";
import { facturasVentaRD } from "./querys/facturasVentaRD";
import { facturasVentaEcuadorACC } from "./querys/facturasVentaEcuadorACC";
import { facturasUruguayFragancia } from "./querys/facturasVentaUruguayFragancia";
import { reporteGeneral } from "./querys/reporteGeneral";

export const querys = {
    getDataOld: {
        PANAMA: {
            BEAUTY: `
                SELECT
                    X.CODIGO,
                    CASE
                        WHEN (X.PAIS = 'COSTA RICA') THEN X.NUM_REG_SAN_CR
                        WHEN (X.PAIS = 'EL SALVADOR') THEN X.NUM_REG_SAN_SAL
                        ELSE X.NUM_REG_SAN_PAN
                    END AS NUM_REG,
                    X.LOTE_PTY AS LOTE,
                    X.MARCA,
                    CASE
                        WHEN (X.PAIS = 'COSTA RICA') THEN X.NOM_REG_SAN_CR
                        WHEN (X.PAIS = 'EL SALVADOR') THEN X.NOM_REG_SAN_SAL
                        ELSE X.NOM_REG_SAN_PMA
                    END AS DESCRIPCION_REG,
                    CASE
                        WHEN (X.PAIS = 'COSTA RICA') THEN X.ESENCIA_REG_SAN_CR
                        WHEN (X.PAIS = 'EL SALVADOR') THEN X.ESENCIA_REG_SAN_SAL
                        ELSE X.ESENCIA_REG_SAN_PMA
                    END AS ESENCIA_REG,
                    X.DESCRIP_ADIC AS DETALLE,
                    X.LABORATORIO_REGS_PM_ AS FABRICANTE,
                    X.PAIS_ORIGEN AS ORIGEN,
                    X.COMPOESP AS COMPOSICION,
                    X.CANTIDAD,
                    X.PRECIO, -- Ya incluye la lógica de seguridad
                    X.TOTAL,
                    X.TOTAL_NETO,
                    X.TOTAL_BRUTO,
                    X.TOTAL_UNIDADES
                FROM
                    (
                        SELECT
                            ART.REFPROVEEDOR AS CODIGO,
                            CLI.PAIS, -- Asumiendo que CLI.PAIS es el correcto del JOIN
                            CAB.FECHA,
                            CAB.FECHARECEPCION,
                            LIN.CODALMACEN,
                            CAB.NUMSERIE,
                            CAB.NUMALBARAN,
                            ART.REFPROVEEDOR AS ESTILO,
                            LIN.TALLA,
                            LIN.COLOR,
                            MAR.DESCRIPCION AS MARCA,
                            ART.DESCRIPCION AS DESCRIPCION,
                            DPT.DESCRIPCION AS DEPARTAMENTO,
                            ACL.*,
                            LIN.UNIDADESTOTAL AS CANTIDAD,
                            -- *** CAMBIO AQUÍ para manejar la división por cero ***
                            (LIN.TOTAL * CAB.FACTORMONEDA) / NULLIF(LIN.UNIDADESTOTAL, 0) AS PRECIO,
                            LIN.DTO,
                            LIN.TOTAL * CAB.FACTORMONEDA AS TOTAL,
                            LIN.TOTAL AS TOTAL_LOC,
                            (SELECT SUM(AVL.TOTAL * AVC.FACTORMONEDA) FROM ALBVENTALIN AVL INNER JOIN ALBVENTACAB AVC ON AVC.NUMALBARAN = AVL.NUMALBARAN AND AVC.NUMSERIE = AVL.NUMSERIE AND AVC.N = AVL.N WHERE AVC.NUMSERIEFAC = @NUMSERIEFAC AND AVC.NUMFAC = @NUMFAC) TOTAL_NETO,
                            (SELECT SUM((AVL.PRECIO * AVC.FACTORMONEDA) * AVL.UNIDADESTOTAL) FROM ALBVENTALIN AVL INNER JOIN ALBVENTACAB AVC ON AVC.NUMALBARAN = AVL.NUMALBARAN AND AVC.NUMSERIE = AVL.NUMSERIE AND AVC.N = AVL.N WHERE AVC.NUMSERIEFAC = @NUMSERIEFAC AND AVC.NUMFAC = @NUMFAC) TOTAL_BRUTO,
                            (SELECT SUM(AVL.UNIDADESTOTAL) FROM ALBVENTALIN AVL INNER JOIN ALBVENTACAB AVC ON AVC.NUMALBARAN = AVL.NUMALBARAN AND AVC.NUMSERIE = AVL.NUMSERIE AND AVC.N = AVL.N WHERE AVC.NUMSERIEFAC = @NUMSERIEFAC AND AVC.NUMFAC = @NUMFAC) TOTAL_UNIDADES
                        FROM
                            BBW_NEW.DBO.ALBVENTACAB AS CAB
                        INNER JOIN
                            BBW_NEW.DBO.ALBVENTALIN AS LIN ON CAB.NUMSERIE = LIN.NUMSERIE
                                                        AND CAB.NUMALBARAN = LIN.NUMALBARAN
                                                        AND CAB.N = LIN.N
                        INNER JOIN
                            BBW_NEW.DBO.ARTICULOS AS ART ON LIN.CODARTICULO = ART.CODARTICULO
                        INNER JOIN
                            BBW_NEW.DBO.ARTICULOSCAMPOSLIBRES AS ACL ON ACL.CODARTICULO = LIN.CODARTICULO
                        INNER JOIN -- Asumiendo que PAIS de CLIENTES es esencial para los CASE externos
                            BBW_NEW.DBO.CLIENTES AS CLI ON CAB.CODCLIENTE = CLI.CODCLIENTE
                        LEFT JOIN
                            BBW_NEW.DBO.MARCA AS MAR ON ART.MARCA = MAR.CODMARCA
                        LEFT JOIN
                            BBW_NEW.DBO.DEPARTAMENTO AS DPT ON ART.DPTO = DPT.NUMDPTO
                        WHERE
                        CAB.NUMSERIEFAC = @NUMSERIEFAC
                        AND CAB.NUMFAC = @NUMFAC
                    ) AS X;
            `,
            ACC:`
                SELECT
                    NUMFAC,
                    CODIGO,
                    X.TALLA,
                    X.DESCRIPCION,
                    X.CODBARRAS,
                    X.DESCRIP_ADIC AS DETALLE,
                    X.PAIS_ORIGEN AS ORIGEN,
                    X.COMPOESP,
                    X.MARCA,
                    X.CANTIDAD,
                    X.PRECIO,
                    X.TOTAL,
                    X.TOTAL_BRUTO,
                    X.TOTAL_NETO,
                    X.TOTAL_UNIDADES
                FROM
                    (
                        SELECT
                            (SELECT ART.REFPROVEEDOR FROM BBW_NEW.DBO.ARTICULOS ART WHERE ART.CODARTICULO = LIN.CODARTICULO) AS CODIGO,
                            CAB.FECHA,
                            CAB.FECHARECEPCION,
                            LIN.CODALMACEN,
                            CAB.NUMSERIE,
                            CAB.NUMALBARAN,
                            CAB.NUMFAC,
                            LIN.TALLA,
                            LIN.COLOR,
                            (SELECT ART.CODBARRAS FROM BBW_NEW.DBO.ARTICULOSLIN ART WHERE ART.CODARTICULO = LIN.CODARTICULO AND ART.TALLA = LIN.TALLA AND LIN.COLOR = ART.COLOR) AS CODBARRAS,
                            (SELECT MAX(M.DESCRIPCION) FROM BBW_NEW.DBO.MARCA M, BBW_NEW.DBO.ARTICULOS A WHERE M.CODMARCA = A.MARCA AND A.CODARTICULO = LIN.CODARTICULO) AS MARCA,
                            (SELECT ART.DESCRIPCION FROM BBW_NEW.DBO.ARTICULOS ART WHERE ART.CODARTICULO = LIN.CODARTICULO) AS DESCRIPCION,
                            (SELECT D.DESCRIPCION FROM BBW_NEW.DBO.DEPARTAMENTO D, BBW_NEW.DBO.ARTICULOS S WHERE D.NUMDPTO = S.DPTO AND S.CODARTICULO = LIN.CODARTICULO) AS DEPARTAMENTO,
                            ACL.*,
                            LIN.UNIDADESTOTAL AS CANTIDAD,
                            -- AQUI ESTÁ LA MODIFICACIÓN: Uso de NULLIF para evitar la división por cero
                            (LIN.TOTAL * CAB.FACTORMONEDA) / NULLIF(LIN.UNIDADESTOTAL, 0) AS PRECIO,
                            LIN.DTO,
                            LIN.TOTAL * CAB.FACTORMONEDA AS TOTAL,
                            LIN.TOTAL AS TOTAL_LOC,
                            (SELECT SUM(AVL.TOTAL * AVC.FACTORMONEDA) FROM ALBVENTALIN AVL INNER JOIN ALBVENTACAB AVC ON AVC.NUMALBARAN = AVL.NUMALBARAN AND AVC.NUMSERIE = AVL.NUMSERIE AND AVC.N = AVL.N WHERE AVC.NUMSERIEFAC = @NUMSERIEFAC AND AVC.NUMFAC = @NUMFAC) TOTAL_NETO,
                            (SELECT SUM((AVL.PRECIO * AVC.FACTORMONEDA) * AVL.UNIDADESTOTAL) FROM ALBVENTALIN AVL INNER JOIN ALBVENTACAB AVC ON AVC.NUMALBARAN = AVL.NUMALBARAN AND AVC.NUMSERIE = AVL.NUMSERIE AND AVC.N = AVL.N WHERE AVC.NUMSERIEFAC = @NUMSERIEFAC AND AVC.NUMFAC = @NUMFAC) TOTAL_BRUTO,
                            (SELECT SUM(AVL.UNIDADESTOTAL) FROM ALBVENTALIN AVL INNER JOIN ALBVENTACAB AVC ON AVC.NUMALBARAN = AVL.NUMALBARAN AND AVC.NUMSERIE = AVL.NUMSERIE AND AVC.N = AVL.N WHERE AVC.NUMSERIEFAC = @NUMSERIEFAC AND AVC.NUMFAC = @NUMFAC) TOTAL_UNIDADES
                        FROM
                            BBW_NEW.DBO.ALBVENTACAB AS CAB
                        INNER JOIN
                            BBW_NEW.DBO.ALBVENTALIN AS LIN ON CAB.NUMSERIE = LIN.NUMSERIE
                                                        AND CAB.NUMALBARAN = LIN.NUMALBARAN
                                                        AND CAB.N = LIN.N
                        INNER JOIN
                            BBW_NEW.DBO.ARTICULOSCAMPOSLIBRES ACL ON ACL.CODARTICULO = LIN.CODARTICULO
                        WHERE
                            CAB.NUMSERIEFAC = @NUMSERIEFAC
                            AND CAB.NUMFAC = @NUMFAC
                    ) AS X;
            `
        },
        'COSTA RICA': {
            BEAUTY: `
                SELECT
                    REFERENCIA,
                    CODBARRAS,
                    CONTENIDO,
                    SUBCLASE,
                    FRAGANCIA,
                    DESCRIPCION_ADICIONAL,
                    COMPOSICION,
                    FINAL_PRODUCT_NAME,
                    REGISTRO_SANITARIO,
                    ORIGEN,
                    MARCA,
                    CASE_PACK,
                    FAMILIA,
                    CANTIDAD,
                    CAST(TOTAL / CASE WHEN (CANTIDAD = 0) THEN 1 ELSE CANTIDAD END AS VARCHAR) AS PRECIO,
                    TOTAL,
                    X.TOTAL_NETO,
                    X.TOTAL_BRUTO,
                    X.TOTAL_UNIDADES
                FROM
                (
                    SELECT
                        (SELECT MAX(L.CODBARRAS) FROM ARTICULOSLIN L WHERE L.CODARTICULO = ALIN.CODARTICULO) AS CODBARRAS,
                        ALIN.TALLA AS CONTENIDO,
                        (SELECT MAX(A.SUBCLASE) FROM ARTICULOSCAMPOSLIBRES A WHERE A.CODARTICULO = ALIN.CODARTICULO) AS SUBCLASE,
                        (SELECT MAX(A.FRANGANCIA) FROM ARTICULOSCAMPOSLIBRES A WHERE A.CODARTICULO = ALIN.CODARTICULO) AS FRAGANCIA,
                        (SELECT MAX(A.DESCRIP_ADIC) FROM ARTICULOSCAMPOSLIBRES A WHERE A.CODARTICULO = ALIN.CODARTICULO) AS DESCRIPCION_ADICIONAL,
                        (SELECT MAX(A.COMPOESP) FROM ARTICULOSCAMPOSLIBRES A WHERE A.CODARTICULO = ALIN.CODARTICULO) AS COMPOSICION,
                        (SELECT MAX(A.FINAL_PRODUCT_NAME) FROM ARTICULOSCAMPOSLIBRES A WHERE A.CODARTICULO = ALIN.CODARTICULO) AS FINAL_PRODUCT_NAME,
                        (SELECT MAX(A.NUM_REG_SAN_CR) FROM ARTICULOSCAMPOSLIBRES A WHERE A.CODARTICULO = ALIN.CODARTICULO) AS REGISTRO_SANITARIO,
                        (SELECT MAX(A.PAIS_ORIGEN) FROM ARTICULOSCAMPOSLIBRES A WHERE A.CODARTICULO = ALIN.CODARTICULO) AS ORIGEN,
                        (SELECT MAX(M.DESCRIPCION) FROM MARCA M, ARTICULOS A WHERE M.CODMARCA = A.MARCA AND A.CODARTICULO = ALIN.CODARTICULO) AS MARCA,
                        (SELECT MAX(A.CASE_PACK) FROM ARTICULOSCAMPOSLIBRES A WHERE A.CODARTICULO = ALIN.CODARTICULO) AS CASE_PACK,
                        ALIN.REFERENCIA AS REFERENCIA,
                        (SELECT F.DESCRIPCION FROM FAMILIAS AS F, ARTICULOS AS R WHERE F.NUMFAMILIA = R.FAMILIA AND R.DPTO = F.NUMDPTO AND R.SECCION = F.NUMSECCION AND R.CODARTICULO = ALIN.CODARTICULO) AS FAMILIA,
                        ALIN.CANTIDAD,
                        ALIN.PRECIO,
                        ALIN.TOTAL,
                        (SELECT SUM(AVL.TOTAL * AVC.FACTORMONEDA) FROM ALBVENTALIN AVL INNER JOIN ALBVENTACAB AVC ON AVC.NUMALBARAN = AVL.NUMALBARAN AND AVC.NUMSERIE = AVL.NUMSERIE AND AVC.N = AVL.N WHERE AVC.NUMSERIEFAC LIKE @NUMSERIEFAC AND AVC.NUMFAC LIKE @NUMFAC) TOTAL_NETO,
                        (SELECT SUM((AVL.PRECIO * AVC.FACTORMONEDA) * AVL.UNIDADESTOTAL) FROM ALBVENTALIN AVL INNER JOIN ALBVENTACAB AVC ON AVC.NUMALBARAN = AVL.NUMALBARAN AND AVC.NUMSERIE = AVL.NUMSERIE AND AVC.N = AVL.N WHERE AVC.NUMSERIEFAC LIKE @NUMSERIEFAC AND AVC.NUMFAC LIKE @NUMFAC) TOTAL_BRUTO,
                        (SELECT SUM(AVL.UNIDADESTOTAL) FROM ALBVENTALIN AVL INNER JOIN ALBVENTACAB AVC ON AVC.NUMALBARAN = AVL.NUMALBARAN AND AVC.NUMSERIE = AVL.NUMSERIE AND AVC.N = AVL.N WHERE AVC.NUMSERIEFAC LIKE @NUMSERIEFAC AND AVC.NUMFAC LIKE @NUMFAC) TOTAL_UNIDADES
                    FROM
                        ALBVENTACAB AS CAB
                    INNER JOIN
                        (
                            SELECT
                                LIN.N,
                                LIN.NUMALBARAN,
                                LIN.NUMSERIE,
                                LIN.CODARTICULO,
                                LIN.CODALMACEN,
                                LIN.REFERENCIA,
                                LIN.COLOR,
                                LIN.TALLA,
                                LIN.UNIDADESTOTAL AS CANTIDAD,
                                (LIN.PRECIO - LIN.PRECIO * (LIN.DTO / 100)) AS PRECIO,
                                LIN.TOTAL AS TOTAL
                            FROM
                                ALBVENTALIN AS LIN
                        ) AS ALIN ON (CAB.NUMSERIE = ALIN.NUMSERIE AND CAB.NUMALBARAN = ALIN.NUMALBARAN AND CAB.N = ALIN.N)
                    WHERE
                        CAB.NUMFAC LIKE @NUMFAC
                        AND CAB.NUMSERIEFAC LIKE @NUMSERIEFAC
                ) AS X;
            `,
            ACC: facturasVentaOtrosACC
        },
        COLOMBIA: {
            BEAUTY: facturasVentaColombia,
            ACC: facturasVentaColombia
        },
        GUATEMALA: {
            BEAUTY: `
                SELECT
                    REFERENCIA,
                    CONTENIDO,
                    DESCRIPCION_ADICIONAL AS DETALLE,
                    REGISTRO_SANITARIO AS DESCRIPCION,
                    FRAGANCIA AS ESCENCIA,
                    ORIGEN,
                    MARCA,
                    CANTIDAD,
                    PRECIO,
                    TOTAL,
                    X.TOTAL_NETO,
                    X.TOTAL_BRUTO,
                    X.TOTAL_UNIDADES
                FROM
                    (
                        SELECT
                            (SELECT L.DESCRIPCION FROM ARTICULOS L WHERE L.CODARTICULO = ALIN.CODARTICULO) AS DESCRIPCION,
                            (SELECT MAX(L.CODBARRAS) FROM ARTICULOSLIN L WHERE L.CODARTICULO = ALIN.CODARTICULO) AS CODBARRAS,
                            ALIN.TALLA AS CONTENIDO,
                            (SELECT MAX(A.SUBCLASE) FROM ARTICULOSCAMPOSLIBRES A WHERE A.CODARTICULO = ALIN.CODARTICULO) AS SUBCLASE,
                            (SELECT MAX(A.FRANGANCIA) FROM ARTICULOSCAMPOSLIBRES A WHERE A.CODARTICULO = ALIN.CODARTICULO) AS FRAGANCIA,
                            (SELECT MAX(A.DESCRIP_ADIC) FROM ARTICULOSCAMPOSLIBRES A WHERE A.CODARTICULO = ALIN.CODARTICULO) AS DESCRIPCION_ADICIONAL,
                            (SELECT MAX(A.COMPOESP) FROM ARTICULOSCAMPOSLIBRES A WHERE A.CODARTICULO = ALIN.CODARTICULO) AS COMPOSICION,
                            (SELECT MAX(A.FINAL_PRODUCT_NAME) FROM ARTICULOSCAMPOSLIBRES A WHERE A.CODARTICULO = ALIN.CODARTICULO) AS PRODUCTO,
                            (SELECT MAX(A.NOM_REG_SAN_PMA) FROM ARTICULOSCAMPOSLIBRES A WHERE A.CODARTICULO = ALIN.CODARTICULO) AS REGISTRO_SANITARIO,
                            (SELECT MAX(A.PAIS_ORIGEN) FROM ARTICULOSCAMPOSLIBRES A WHERE A.CODARTICULO = ALIN.CODARTICULO) AS ORIGEN,
                            (SELECT MAX(M.DESCRIPCION) FROM MARCA M, ARTICULOS A WHERE M.CODMARCA = A.MARCA AND A.CODARTICULO = ALIN.CODARTICULO) AS MARCA,
                            (SELECT MAX(A.CASE_PACK) FROM ARTICULOSCAMPOSLIBRES A WHERE A.CODARTICULO = ALIN.CODARTICULO) AS CASE_PACK,
                            ALIN.REFERENCIA AS REFERENCIA,
                            (SELECT F.DESCRIPCION FROM FAMILIAS AS F, ARTICULOS AS R WHERE F.NUMFAMILIA = R.FAMILIA AND R.DPTO = F.NUMDPTO AND R.SECCION = F.NUMSECCION AND R.CODARTICULO = ALIN.CODARTICULO) AS FAMILIA,
                            ALIN.CANTIDAD,
                            (ALIN.PRECIO - ALIN.PRECIO * (ALIN.DTO / 100)) AS PRECIO,
                            ALIN.TOTAL AS TOTAL,
                            (SELECT SUM(AVL.TOTAL * AVC.FACTORMONEDA) FROM ALBVENTALIN AVL INNER JOIN ALBVENTACAB AVC ON AVC.NUMALBARAN = AVL.NUMALBARAN AND AVC.NUMSERIE = AVL.NUMSERIE AND AVC.N = AVL.N WHERE AVC.NUMSERIEFAC LIKE @NUMSERIEFAC AND AVC.NUMFAC LIKE @NUMFAC) TOTAL_NETO,
                            (SELECT SUM((AVL.PRECIO * AVC.FACTORMONEDA) * AVL.UNIDADESTOTAL) FROM ALBVENTALIN AVL INNER JOIN ALBVENTACAB AVC ON AVC.NUMALBARAN = AVL.NUMALBARAN AND AVC.NUMSERIE = AVL.NUMSERIE AND AVC.N = AVL.N WHERE AVC.NUMSERIEFAC LIKE @NUMSERIEFAC AND AVC.NUMFAC LIKE @NUMFAC) TOTAL_BRUTO,
                            (SELECT SUM(AVL.UNIDADESTOTAL) FROM ALBVENTALIN AVL INNER JOIN ALBVENTACAB AVC ON AVC.NUMALBARAN = AVL.NUMALBARAN AND AVC.NUMSERIE = AVL.NUMSERIE AND AVC.N = AVL.N WHERE AVC.NUMSERIEFAC LIKE @NUMSERIEFAC AND AVC.NUMFAC LIKE @NUMFAC) TOTAL_UNIDADES
                        FROM
                            ALBVENTACAB AS CAB
                        INNER JOIN
                            (
                                SELECT
                                    LIN.N,
                                    LIN.NUMSERIE,
                                    LIN.NUMALBARAN,
                                    LIN.CODARTICULO,
                                    LIN.CODALMACEN,
                                    LIN.REFERENCIA,
                                    LIN.COLOR,
                                    LIN.TALLA,
                                    LIN.DTO,
                                    LIN.UNIDADESTOTAL AS CANTIDAD,
                                    (LIN.PRECIO - LIN.PRECIO * (LIN.DTO / 100)) AS PRECIO,
                                    LIN.TOTAL AS TOTAL
                                FROM
                                    ALBVENTALIN AS LIN
                            ) AS ALIN ON (CAB.NUMSERIE = ALIN.NUMSERIE AND CAB.NUMALBARAN = ALIN.NUMALBARAN AND CAB.N = ALIN.N)
                        WHERE
                            CAB.NUMFAC LIKE @NUMFAC
                            AND CAB.NUMSERIEFAC LIKE @NUMSERIEFAC
                    ) AS X;
            `,
            ACC: facturasVentaOtrosACC
        },
        PERU: {
            BEAUTY: `
                SELECT
                    CODIGO,
                    X.TALLA,
                    X.DESCRIPCION,
                    X.CODBARRAS,
                    X.DESCRIP_ADIC AS DETALLE,
                    X.LOTE_PTY,
                    X.PAIS_ORIGEN AS ORIGEN,
                    X.COMPOESP,
                    X.MARCA,
                    X.CANTIDAD,
                    X.PRECIO,
                    X.TOTAL
                FROM
                    (
                        SELECT
                            (SELECT ART.REFPROVEEDOR FROM BBW_NEW.DBO.ARTICULOS ART WHERE ART.CODARTICULO = LIN.CODARTICULO) AS CODIGO,
                            CAB.FECHA,
                            CAB.FECHARECEPCION,
                            LIN.CODALMACEN,
                            CAB.NUMSERIE,
                            CAB.NUMALBARAN,
                            LIN.TALLA,
                            LIN.COLOR,
                            (SELECT ART.CODBARRAS FROM BBW_NEW.DBO.ARTICULOSLIN ART WHERE ART.CODARTICULO = LIN.CODARTICULO AND ART.TALLA = LIN.TALLA AND LIN.COLOR = ART.COLOR) AS CODBARRAS,
                            (SELECT MAX(M.DESCRIPCION) FROM BBW_NEW.DBO.MARCA M, BBW_NEW.DBO.ARTICULOS A WHERE M.CODMARCA = A.MARCA AND A.CODARTICULO = LIN.CODARTICULO) AS MARCA,
                            (SELECT ART.DESCRIPCION FROM BBW_NEW.DBO.ARTICULOS ART WHERE ART.CODARTICULO = LIN.CODARTICULO) AS DESCRIPCION,
                            (SELECT D.DESCRIPCION FROM BBW_NEW.DBO.DEPARTAMENTO D, BBW_NEW.DBO.ARTICULOS S WHERE D.NUMDPTO = S.DPTO AND S.CODARTICULO = LIN.CODARTICULO) AS DEPARTAMENTO,
                            ACL.*,
                            LIN.UNIDADESTOTAL AS CANTIDAD,
                            (LIN.TOTAL * CAB.FACTORMONEDA) / LIN.UNIDADESTOTAL AS PRECIO,
                            LIN.DTO,
                            LIN.TOTAL * CAB.FACTORMONEDA AS TOTAL,
                            LIN.TOTAL AS TOTAL_LOC
                        FROM
                            BBW_NEW.DBO.ALBVENTACAB AS CAB
                        INNER JOIN
                            BBW_NEW.DBO.ALBVENTALIN AS LIN ON (CAB.NUMSERIE = LIN.NUMSERIE AND CAB.NUMALBARAN = LIN.NUMALBARAN AND CAB.N = LIN.N)
                        INNER JOIN
                            BBW_NEW.DBO.ARTICULOSCAMPOSLIBRES ACL ON (ACL.CODARTICULO = LIN.CODARTICULO)
                        WHERE
                            CAB.NUMFAC = @NUMFAC
                            AND CAB.NUMSERIEFAC = @NUMSERIEFAC
                    ) AS X;
            `,
            ACC: facturasVentaOtrosACC
        },
        PARAGUAY: {
            BEAUTY: `
                SELECT
                    CODIGO,
                    X.TALLA,
                    X.DESCRIPCION,
                    X.CODBARRAS,
                    X.DESCRIP_ADIC AS DETALLE,
                    X.LOTE_PTY,
                    X.PAIS_ORIGEN AS ORIGEN,
                    X.COMPOESP,
                    X.MARCA,
                    X.CANTIDAD,
                    X.PRECIO,
                    X.TOTAL
                FROM
                    (
                        SELECT
                            (SELECT ART.REFPROVEEDOR FROM BBW_NEW.DBO.ARTICULOS ART WHERE ART.CODARTICULO = LIN.CODARTICULO) AS CODIGO,
                            CAB.FECHA,
                            CAB.FECHARECEPCION,
                            LIN.CODALMACEN,
                            CAB.NUMSERIE,
                            CAB.NUMALBARAN,
                            LIN.TALLA,
                            LIN.COLOR,
                            (SELECT ART.CODBARRAS FROM BBW_NEW.DBO.ARTICULOSLIN ART WHERE ART.CODARTICULO = LIN.CODARTICULO AND ART.TALLA = LIN.TALLA AND LIN.COLOR = ART.COLOR) AS CODBARRAS,
                            (SELECT MAX(M.DESCRIPCION) FROM BBW_NEW.DBO.MARCA M, BBW_NEW.DBO.ARTICULOS A WHERE M.CODMARCA = A.MARCA AND A.CODARTICULO = LIN.CODARTICULO) AS MARCA,
                            (SELECT ART.DESCRIPCION FROM BBW_NEW.DBO.ARTICULOS ART WHERE ART.CODARTICULO = LIN.CODARTICULO) AS DESCRIPCION,
                            (SELECT D.DESCRIPCION FROM BBW_NEW.DBO.DEPARTAMENTO D, BBW_NEW.DBO.ARTICULOS S WHERE D.NUMDPTO = S.DPTO AND S.CODARTICULO = LIN.CODARTICULO) AS DEPARTAMENTO,
                            ACL.*,
                            LIN.UNIDADESTOTAL AS CANTIDAD,
                            (LIN.TOTAL * CAB.FACTORMONEDA) / LIN.UNIDADESTOTAL AS PRECIO,
                            LIN.DTO,
                            LIN.TOTAL * CAB.FACTORMONEDA AS TOTAL,
                            LIN.TOTAL AS TOTAL_LOC
                        FROM
                            BBW_NEW.DBO.ALBVENTACAB AS CAB
                        INNER JOIN
                            BBW_NEW.DBO.ALBVENTALIN AS LIN ON (CAB.NUMSERIE = LIN.NUMSERIE AND CAB.NUMALBARAN = LIN.NUMALBARAN AND CAB.N = LIN.N)
                        INNER JOIN
                            BBW_NEW.DBO.ARTICULOSCAMPOSLIBRES ACL ON (ACL.CODARTICULO = LIN.CODARTICULO)
                        WHERE
                            CAB.NUMFAC = @NUMFAC
                            AND CAB.NUMSERIEFAC = @NUMSERIEFAC
                    ) AS X;
            `,
            ACC: facturasVentaOtrosACC
        },
        'REPUBLICA DOMINICANA': {
            BEAUTY: facturasVentaRD,
            ACC: facturasVentaRD
        },
        CURACAO: {
            BEAUTY: facturasVentaOtrosACC,
            ACC: facturasVentaOtrosACC
        },
        SALVADOR: {
            BEAUTY: `
                SELECT
                    REFERENCIA,
                    CODBARRAS,
                    CONTENIDO,
                    SUBCLASE,
                    FRAGANCIA,
                    DESCRIPCION_ADICIONAL,
                    COMPOSICION,
                    PRODUCTO,
                    REGISTRO_SANITARIO,
                    ORIGEN,
                    MARCA,
                    CASE_PACK,
                    FAMILIA,
                    CANTIDAD,
                    PRECIO,
                    TOTAL
                FROM
                    (
                        SELECT
                            (SELECT MAX(L.CODBARRAS) FROM ARTICULOSLIN L WHERE L.CODARTICULO = ALIN.CODARTICULO) AS CODBARRAS,
                            ALIN.TALLA AS CONTENIDO,
                            (SELECT MAX(A.SUBCLASE) FROM ARTICULOSCAMPOSLIBRES A WHERE A.CODARTICULO = ALIN.CODARTICULO) AS SUBCLASE,
                            (SELECT MAX(A.FRANGANCIA) FROM ARTICULOSCAMPOSLIBRES A WHERE A.CODARTICULO = ALIN.CODARTICULO) AS FRAGANCIA,
                            (SELECT MAX(A.DESCRIP_ADIC) FROM ARTICULOSCAMPOSLIBRES A WHERE A.CODARTICULO = ALIN.CODARTICULO) AS DESCRIPCION_ADICIONAL,
                            (SELECT MAX(A.COMPOESP) FROM ARTICULOSCAMPOSLIBRES A WHERE A.CODARTICULO = ALIN.CODARTICULO) AS COMPOSICION,
                            (SELECT MAX(A.FINAL_PRODUCT_NAME) FROM ARTICULOSCAMPOSLIBRES A WHERE A.CODARTICULO = ALIN.CODARTICULO) AS PRODUCTO,
                            (SELECT MAX(A.NUM_REG_SAN_SAL) FROM ARTICULOSCAMPOSLIBRES A WHERE A.CODARTICULO = ALIN.CODARTICULO) AS REGISTRO_SANITARIO,
                            (SELECT MAX(A.PAIS_ORIGEN) FROM ARTICULOSCAMPOSLIBRES A WHERE A.CODARTICULO = ALIN.CODARTICULO) AS ORIGEN,
                            (SELECT MAX(M.DESCRIPCION) FROM MARCA M, ARTICULOS A WHERE M.CODMARCA = A.MARCA AND A.CODARTICULO = ALIN.CODARTICULO) AS MARCA,
                            (SELECT MAX(A.CASE_PACK) FROM ARTICULOSCAMPOSLIBRES A WHERE A.CODARTICULO = ALIN.CODARTICULO) AS CASE_PACK,
                            ALIN.REFERENCIA AS REFERENCIA,
                            (SELECT F.DESCRIPCION FROM FAMILIAS AS F, ARTICULOS AS R WHERE F.NUMFAMILIA = R.FAMILIA AND R.DPTO = F.NUMDPTO AND R.SECCION = F.NUMSECCION AND R.CODARTICULO = ALIN.CODARTICULO) AS FAMILIA,
                            ALIN.CANTIDAD,
                            ALIN.PRECIO,
                            ALIN.TOTAL
                        FROM
                            ALBVENTACAB AS CAB
                        INNER JOIN
                            (
                                SELECT
                                    LIN.N,
                                    LIN.NUMALBARAN,
                                    LIN.NUMSERIE,
                                    LIN.CODARTICULO,
                                    LIN.CODALMACEN,
                                    LIN.REFERENCIA,
                                    LIN.COLOR,
                                    LIN.TALLA,
                                    LIN.UNIDADESTOTAL AS CANTIDAD,
                                    (LIN.PRECIO - LIN.PRECIO * (LIN.DTO / 100)) AS PRECIO,
                                    LIN.TOTAL AS TOTAL
                                FROM
                                    ALBVENTALIN AS LIN
                            ) AS ALIN ON (CAB.NUMSERIE = ALIN.NUMSERIE AND CAB.NUMALBARAN = ALIN.NUMALBARAN AND CAB.N = ALIN.N)
                        WHERE
                            CAB.NUMFAC = @NUMFAC
                            AND CAB.NUMSERIEFAC = @NUMSERIEFAC
                    ) AS X;
            `,
            ACC: facturasVentaOtrosACC
        },
        URUGUAY: {
            BEAUTY: facturasUruguayFragancia,
            ACC: facturasVentaEcuadorACC
        },
        ECUADOR: {
            BEAUTY: `
                SELECT
                    X.ARTICULO,
                    X.CODBARRAS AS "CODIGO",
                    X.TALLA AS CONTENIDO,
                    X.DESCRIPCION,
                    X.DESCRIP_ADIC AS DETALLE,
                    X.COMPOESP AS COMPOSICION,
                    X.FRANGANCIA AS FRAGANCIA,
                    X.GIFTCONTNEW AS "SET DE REGALO",
                    X.PAIS_ORIGEN AS ORIGEN,
                    X.MARCA,
                    X.CANTIDAD,
                    X.PRECIO,
                    X.TOTAL
                FROM
                    (
                        SELECT
                            LIN.REFERENCIA AS ARTICULO,
                            CAB.FECHA,
                            CAB.FECHARECEPCION,
                            LIN.CODALMACEN,
                            CAB.NUMSERIE,
                            CAB.NUMALBARAN,
                            LIN.TALLA,
                            LIN.COLOR,
                            (SELECT ART.CODBARRAS FROM BBW_NEW.DBO.ARTICULOSLIN ART WHERE ART.CODARTICULO = LIN.CODARTICULO AND ART.TALLA = LIN.TALLA AND LIN.COLOR = ART.COLOR) AS CODBARRAS,
                            (SELECT MAX(M.DESCRIPCION) FROM BBW_NEW.DBO.MARCA M, BBW_NEW.DBO.ARTICULOS A WHERE M.CODMARCA = A.MARCA AND A.CODARTICULO = LIN.CODARTICULO) AS MARCA,
                            (SELECT ART.DESCRIPCION FROM BBW_NEW.DBO.ARTICULOS ART WHERE ART.CODARTICULO = LIN.CODARTICULO) AS DESCRIPCION,
                            (SELECT D.DESCRIPCION FROM BBW_NEW.DBO.DEPARTAMENTO D, BBW_NEW.DBO.ARTICULOS S WHERE D.NUMDPTO = S.DPTO AND S.CODARTICULO = LIN.CODARTICULO) AS DEPARTAMENTO,
                            ACL.*,
                            LIN.UNIDADESTOTAL AS CANTIDAD,
                            (LIN.TOTAL * CAB.FACTORMONEDA) / LIN.UNIDADESTOTAL AS PRECIO,
                            LIN.DTO,
                            LIN.TOTAL * CAB.FACTORMONEDA AS TOTAL,
                            LIN.TOTAL AS TOTAL_LOC
                        FROM
                            BBW_NEW.DBO.ALBVENTACAB AS CAB
                        INNER JOIN
                            BBW_NEW.DBO.ALBVENTALIN AS LIN ON (CAB.NUMSERIE = LIN.NUMSERIE AND CAB.NUMALBARAN = LIN.NUMALBARAN AND CAB.N = LIN.N)
                        INNER JOIN
                            BBW_NEW.DBO.ARTICULOSCAMPOSLIBRES ACL ON (ACL.CODARTICULO = LIN.CODARTICULO)
                        WHERE
                            CAB.NUMFAC = @NUMFAC
                            AND CAB.NUMSERIEFAC = @NUMSERIEFAC
                    ) AS X;
            `,
            ACC: facturasVentaEcuadorACC
        },
        VENEZUELA: {
            BEAUTY: facturasVentaOtrosACC,
            ACC: facturasVentaOtrosACC
        },
        ARGENTINA: {
            BEAUTY: facturasUruguayFragancia,
            ACC: facturasVentaEcuadorACC
        }
    }, 
    getData: reporteGeneral,
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
    `
  
};