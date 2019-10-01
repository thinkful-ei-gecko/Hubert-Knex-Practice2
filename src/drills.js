require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
})

function searchByTermName(searchTerm) {
  knexInstance('shopping_list')
    .select('name', 'price', 'date_added', 'checked', 'category')
    .where('name', 'ilike', `%${searchTerm}%`)
    //.then(res => console.log(res))
}

function paginateList(pageNumber) {
  const itemsPerPage = 6;
  const offset = itemsPerPage * (pageNumber - 1); 

  knexInstance('shopping_list')
    .select('name', 'price', 'date_added', 'checked', 'category')
    .limit(itemsPerPage)
    .offset(offset)
    //.then(res => console.log(res))
}

function greaterThanDays(daysAgo) {
  knexInstance('shopping_list')
    .select('name', 'price', 'date_added', 'checked', 'category')
    .where(
      'date_added',
      '>',
      knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
    )
    .orderBy([
      { column: 'price', order: 'ASC'}
    ])
    //.then(res => console.log(res))
}

function totalPrice() {
  knexInstance('shopping_list')
    .select('category')
    .sum('price as total')
    .groupBy('category')
    .orderBy([
      { column: 'total', order: 'DESC'}
    ])
    .then(res => console.log(res))
    .finally(() => knexInstance.destroy())
}

//searchByTermName('burg')
//paginateList(3)
//greaterThanDays(1)
totalPrice()