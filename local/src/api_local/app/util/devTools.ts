import database from '../config/db_local.config'
import logger from '../util/logger'

const HttpStatus = {
    OK: { code: 200, status: 'OK' },
    CREATED: { code: 201, status: 'CREATED' },
    NO_CONTENT: { code: 204, status: 'NO_CONTENT' },
    BAD_REQUEST: { code: 400, status: 'BAD_REQUEST' },
    NOT_FOUND: { code: 404, status: 'NOT_FOUND' },
    INTERNAL_SERVER_ERROR: { code: 500, status: 'INTERNAL_SERVER_ERROR' }
};

const relations = {
    "buildings": "usersBuildings",
    "users": "usersBuildings",
    "sousscenarios": "scenariosousscenarios",
    "scenario": "scenariosousscenarios",
    "devices": "timeseries"
}

const tables = ["buildings", "floors", "rooms", "devices", "sousscenarios", "scenariosousscenarios"]

// users, usersBuildings, scenario, scenariosousscenarios, timeseries
async function getEltToDelete(elt: string, id_elt: string) {
    logger.info("DELETE " + elt + " with " + id_elt)
    if (tables.includes(elt)) {
        logger.info(elt + " is in tables")
        const eltsIds = await database.keys(elt + ":*");
        const eltsToDelete: string[] = [];
        logger.info("LAA " + eltsIds)
        await Promise.all(eltsIds.map(async (id: string) => {
            const eltData = await database.hgetall(id);
            let previousIndex = tables.indexOf(elt) - 1
            if (previousIndex >= 0) {
                logger.info(tables[previousIndex])
                if (eltData[`${tables[previousIndex].slice(0, -1)}_id`] === id_elt.toString().split(":")[1]) {
                    logger.info("id eltData : " + eltData[`${tables[previousIndex].slice(0, -1)}_id`])
                    eltsToDelete.push(id);
                }
            }
        }));
        logger.info("test contenu eltsToDelete " + eltsToDelete)
        logger.info("test taille eltsToDelete " + eltsToDelete.length)
        if (eltsToDelete.length > 0) {
            logger.info("TEST : " + eltsToDelete)
            for (let eltToDelete in eltsToDelete) {
                let nextIndex = tables.indexOf(elt) + 1
                if (nextIndex < tables.length) {
                    logger.info("recursion")
                    await getEltToDelete(tables[nextIndex], eltsToDelete[eltToDelete])
                }
            }
        }
        await deleteElt(id_elt)
    }
}

// async function getRelationToDelete(id_elt: string) {
//     const verifyId = id_elt.split(":")[0]
//     if (verifyId in relations) {
//         logger.info(verifyId + " is in relations")
//         const eltsIds = await database.keys(verifyId + ":*");
//         const eltsToDelete: string[] = [];
//         logger.info("LAA " + eltsIds)
//         await Promise.all(eltsIds.map(async (id: string) => {
//             const eltData = await database.hgetall(id);
//             let previousIndex = tables.indexOf(elt) - 1
//             if (previousIndex >= 0) {
//                 logger.info(tables[previousIndex])
//                 if (eltData[`${tables[previousIndex].slice(0, -1)}_id`] === id_elt.toString().split(":")[1]) {
//                     logger.info("id eltData : " + eltData[`${tables[previousIndex].slice(0, -1)}_id`])
//                     eltsToDelete.push(id);
//                 }
//             }
//         }));
//         logger.info("test contenu eltsToDelete " + eltsToDelete)
//         logger.info("test taille eltsToDelete " + eltsToDelete.length)
//         if (eltsToDelete.length > 0) {
//             logger.info("TEST : " + eltsToDelete)
//             for (let eltToDelete in eltsToDelete) {
//                 let nextIndex = tables.indexOf(elt) + 1
//                 if (nextIndex < tables.length) {
//                     logger.info("recursion")
//                     await getEltToDelete(tables[nextIndex], eltsToDelete[eltToDelete])
//                 }
//             }
//         }
//         await deleteElt(id_elt)
//     }
// }

async function deleteElt(id: string) {
    logger.info("deleteElt")
    if (!await database.exists(`${id}`)) {
        throw new Error('bad_request')
    }
    try {
        //regarder si on a une relation a delete en plus


        await database.del(`${id}`)
    } catch (err) {
        throw new Error('internal_server_error')
    }
}


export default HttpStatus;
export { getEltToDelete, deleteElt };