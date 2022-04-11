const config = require("./options/SQLite3");
const knex = require("knex");

class Archivador {
    constructor(tableName, config) {
        this.tableName = tableName;
        this.knex = knex(config);
    }

    async save(data) {
        if (this.check(data)) {
            knex(this.tableName)
                .insert(data)
                .then(() => console.log("Guardado! =>", data))
                .catch((e) => console.log(e))
                .finally(() => knex.destroy());
        }
    }
}

module.exports = Archivador;