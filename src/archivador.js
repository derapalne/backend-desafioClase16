const knex = require("knex");

class Archivador {
    constructor(tableName, config) {
        this.tableName = tableName;
        this.knex = knex(config);
    }

    async save(data) {
        if (this.check(data)) {
            this.knex(this.tableName)
                .insert(data)
                .then(() => {
                    console.log("Guardado! =>", data);
                    return 1;
                })
                .catch((e) => console.log(e))
                .finally(() => this.knex.destroy());
        }
    }
}

module.exports = Archivador;