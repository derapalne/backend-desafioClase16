const Archivador = require('./archivador');


class ArchivadorMensajes extends Archivador {
    constructor(tableName, config) {
        super(tableName, config);
    }

    async read() {
        await this.knex(this.tableName)
            .select("*")
            .then((mensajes) => {
                return mensajes;
            })
            .catch((e) => console.log(e))
            .finally(() => this.knex.destroy);
    }

    async chequearTabla() {
        this.knex.schema.hasTable(this.tableName).then((exists) => {
            if (!exists) {
                this.knex.schema
                    .createTable(this.tableName, (table) => {
                        table.increments("id");
                        table.string("texto");
                        table.string("mail");
                        table.string("timestamp");
                    })
                    .then(() => console.log("Tabla Creada:", this.tableName))
                    .catch((e) => console.log(e))
                    //.finally(() => this.knex.destroy());
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