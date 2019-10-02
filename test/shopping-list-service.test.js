const ShoppingListService = require('../src/shopping-list-service');
const knex = require('knex');

describe('Shopping list object', function() {
  let db;

  let testLists = [
    {
      id: 1,
      name: 'First Name',
      price: "12.00",
      date_added: new Date('2029-01-22T16:28:32.615Z'),
      checked: false,
      category: 'Main' 
    },
    {
      id: 2,
      name: 'Second Name',
      price: "4.00",
      date_added: new Date('2029-01-22T16:28:32.615Z'),
      checked: true,
      category: 'Snack' 
    },
    {
      id: 3,
      name: 'Third Name',
      price: "20.00",
      date_added: new Date('2029-01-22T16:28:32.615Z'),
      checked: false,
      category: 'Breakfast' 
    }
  ]
  
  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    })
  })

  after(() => db.destroy());
  before(() => db('shopping_list').truncate())
  afterEach(() => db('shopping_list').truncate())

  context(`When 'shopping_list' has data`, () => {
    beforeEach(() => {
      return db
        .into('shopping_list')
        .insert(testLists)
    })
    
    it(`getList() resolves all articles from 'shopping_list' table`, () => {
      return ShoppingListService.getList(db)
        .then(actual => {
          expect(actual).to.eql(testLists)
        })
    })

    it(`getById() resolves a list by id from 'shopping_list'`, () => {
      const secondId = 2;
      const secondTestList = testLists[secondId - 1];
      return ShoppingListService.getById(db, secondId)
        .then(actual => {
          expect(actual).to.eql({
            id: secondId,
            name: secondTestList.name,
            price: secondTestList.price,
            category: secondTestList.category,
            checked: secondTestList.checked,
            date_added: secondTestList.date_added
          })
        })
    })

    it(`deleteList() removes a list by id from 'shopping_list'`, () => {
      const listId = 3;
      return ShoppingListService.deleteList(db, listId)
        .then(() => ShoppingListService.getList(db))
        .then(allLists => {
          const expected = testLists.filter(list => list.id !== listId)
          expect(allLists).to.eql(expected)
        })
    })

    it(`updateList() updates list from the 'shopping_list' table`, () => {
      const idListToUpdate = 2;
      const newListData = {
        name: 'updated name',
        price: "5.00",
        category: 'Breakfast',
        checked: false,
        date_added: new Date()
      }
      return ShoppingListService.updateList(db, idListToUpdate, newListData)
        .then(() => ShoppingListService.getById(db, idListToUpdate))
        .then(list => {
          expect(list).to.eql({
            id: idListToUpdate,
            ...newListData,
          })
        })
    })
  })

  context(`When 'shopping_list' has no data`, () => {
    it(`getList() resolves an empty array`, () => {
      return ShoppingListService.getList(db)
        .then(actual => {
          expect(actual).to.eql([])
        })
    })

    it(`insertList() inserts a new article and resolves with an 'id'`, () => {
      const newList = {
        id: 2,
        name: 'Test new name',
        price: "20.00",
        category: "Main",
        checked: true,
        date_added: new Date()
      }
      return ShoppingListService.insertList(db, newList)
        .then(actual => {
          expect(actual).to.eql({
            id: newList.id,
            name: newList.name,
            price: newList.price,
            category: newList.category,
            checked: newList.checked,
            date_added: newList.date_added
          })
          expect(actual).to.be.an('object')
        })
    })
  })

})