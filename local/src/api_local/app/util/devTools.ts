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

const relations: { [key: string]: string } = {
    "buildings": "usersBuildings",
    "users": "usersBuildings",
    "sousScenarios": "scenariosSousScenarios",
    "scenarios": "scenariosSousScenarios",
    "devices": "timeseries"
}

const tables = ["buildings", "floors", "rooms", "devices", "sousscenarios", "scenariosousscenarios"]

// users, usersBuildings, scenario, scenariosousscenarios, timeseries
async function getEltToDelete(elt: string, id_elt: string) {
    if (tables.includes(elt)) {
        const eltsIds = await database.keys(elt + ":*");
        const eltsToDelete: string[] = [];
        await Promise.all(eltsIds.map(async (id: string) => {
            const eltData = await database.hgetall(id);
            let previousIndex = tables.indexOf(elt) - 1
            if (previousIndex >= 0) {
                if (eltData[`${tables[previousIndex].slice(0, -1)}_id`] === id_elt.toString().split(":")[1]) {
                    eltsToDelete.push(id);
                }
            }
        }));
        if (eltsToDelete.length > 0) {
            for (let eltToDelete in eltsToDelete) {
                let nextIndex = tables.indexOf(elt) + 1
                if (nextIndex < tables.length) {
                    await getEltToDelete(tables[nextIndex], eltsToDelete[eltToDelete])
                }
            }
        }
        await deleteElt(id_elt)
    }
}

async function getRelationToDelete(id_elt: string) {
    const verifyId = id_elt.split(":")[0]
    if (verifyId in relations) {
        const eltsIds = await database.keys(relations[verifyId] + ":*");
        const eltsToDelete: string[] = [];
        await Promise.all(eltsIds.map(async (id: string) => {
            const eltData = await database.hgetall(id);
            if (eltData[`${verifyId.slice(0, -1)}_id`] === id_elt.toString().split(":")[1]) {
                eltsToDelete.push(id);
            }
        }));
        for (let eltToDelete in eltsToDelete) {
            await deleteElt(eltsToDelete[eltToDelete])
        }
    }
}

async function deleteElt(id: string) {
    if (!await database.exists(`${id}`)) {
        throw new Error('not_found')
    }
    try {
        await database.del(`${id}`)
    } catch (err) {
        throw new Error('internal_server_error')
    }
}


export default HttpStatus;
export { getEltToDelete, deleteElt, getRelationToDelete };