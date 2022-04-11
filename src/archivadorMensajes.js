const Archivador = require('./archivador');


class ArchivadorMensajes extends Archivador {
    constructor(tableName, config) {
        super(tableName, config);
    }

    async read() {
        await knex(this.tableName)
            .select("*")
            .then((mensajes) => {
                return mensajes;
            })
            .catch((e) => console.log(e))
            .finally(() => knex.destroy);
    }

    async chequearTabla() {
        knex.schema.hasTable(tableName).then((exists) => {
            if (!exists) {
                knex.schema
                    .createTable(tableName, (table) => {
                        table.increments("id");
                        table.string("texto");
                        table.string("mail");
                        table.string("timestamp");
                    })
                    .then(() => console.log("Tabla Creada:", tableName))
                    .catch((e) => console.log(e))
                    .finally(() => knex.destroy());
            } else {
                console.log("Tabla Mensajes existente.");
            }
        });
    }

    check(mensaje) {
        if (!mensaje.texto) {
            return false;
        }
        if (!mensaje.mail) {
            return false;
        }
        if (!mensaje.timestamp) {
            return false;
        }
        return true;
    }
}

module.exports = ArchivadorMensajes;