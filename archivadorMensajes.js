const config = require("./options/SQLite3");
const knex = require("knex");

class Archivador {
    constructor(tableName, config) {
        this.tableName = tableName;
        this.knex = knex(config);
    }
}

class ArchivadorMensajes extends Archivador {
    constructor(tableName, config) {
        super(tableName, config);
    }

    async save(mensaje) {
        if (this.check(mensaje)) {
            knex(this.tableName)
                .insert(mensaje)
                .then(() => console.log("Mensaje guardado", mensaje))
                .catch((e) => console.log(e))
                .finally(() => knex.destroy());
        }
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

class ArchivadorProductos extends Archivador {
    constructor(tableName, config) {
        super(tableName, config);
    }

    async save(producto) {
        if (this.check(producto)) {
            knex(this.tableName)
                .insert(producto)
                .then(() => console.log("Mensaje guardado", producto))
                .catch((e) => console.log(e))
                .finally(() => knex.destroy());
        }
    }

    async getAll() {
        await knex(this.tableName)
            .select("*")
            .then((mensajes) => {
                return mensajes;
            })
            .catch((e) => console.log(e))
            .finally(() => knex.destroy);
    }

    async getById(id) {
        await knex(this.tableName)
            .where({ id: id })
            .select("*")
            .then((producto) => {
                return producto;
            })
            .catch((e) => console.log(e))
            .finally(() => knex.destroy);
    }

    async setById(id, producto) {
        if (this.check(producto)) {
            await knex(this.tableName)
                .where({ id: id })
                .update({
                    title: producto.title,
                    price: producto.price,
                    thumbnail: producto.thumbnail,
                })
                .then(() => console.log("Producto modificado"))
                .catch((e) => console.log(e))
                .finally(() => knex.destroy);
        } else {
            console.log("Producto inválido.");
        }
    }

    async deleteById(id) {
        await knex(this.tableName)
            .where({ id: id })
            .del()
            .then(() => console.log("Producto borrado"))
            .catch((e) => console.log(e))
            .finally(() => knex.destroy());
    }

    async chequearTabla() {
        knex.schema.hasTable(tableName).then((exists) => {
            if (!exists) {
                knex.schema
                    .createTable(tableName, (table) => {
                        table.increments("id");
                        table.string("title");
                        table.float("price");
                        table.string("thumbnail");
                    })
                    .then(() => console.log("Tabla Creada:", tableName))
                    .catch((e) => console.log(e))
                    .finally(() => knex.destroy());
            }
        });
    }

    check(producto) {
        if (!producto.title) {
            return false;
        }
        if (!producto.price) {
            return false;
        } else {
            const price = Number(producto.price);
            if (isNaN(price)) {
                return false;
            }
        }
        if (!producto.thumbnail) {
            return false;
        }
        return true;
    }
}
