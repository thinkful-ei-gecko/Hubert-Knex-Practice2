const ShoppingListService = {
  getList(knex) {
    return knex('shopping_list').select('*')
  },

  insertList(knex, newList) {
    return knex
      .insert(newList)
      .into('shopping_list')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },

  getById(knex, id) {
    return knex('shopping_list')
      .select('*')
      .where('id', id)
      .first()
  },

  deleteList(knex, id) {
    return knex('shopping_list')
      .where({ id })
      .delete()
  },

  updateList(knex, id, newListData) {
    return knex('shopping_list')
      .where({ id })
      .update(newListData)
  }
}

module.exports = ShoppingListService;