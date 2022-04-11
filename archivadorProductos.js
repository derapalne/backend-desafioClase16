const Archivador = require('./archivador');

class ArchivadorProductos extends Archivador {
    constructor(tableName, config) {
        super(tableName, config);
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
            } else {
                console.log("Tabla Productos existente.");
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

module.exports = ArchivadorProductos;