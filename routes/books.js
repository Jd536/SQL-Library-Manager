var express = require('express');
var router = express.Router();

var Books = require("../models").Books;

/* GET users listing. */
router.get('/', function(req, res, next) {
  Books.findAll({
    // attributes: ['title', 'author','genre','year']
    raw:true
  })
  .then( books =>{
    res.render('index',{ title: 'SQL-Library-Manager', books })
  })
  
  });


//- Shows the create new book form.
router.get('/new', (req, res, next) =>{
  res.render('new-book', {pageTitle:'New Book'});
});

// - Posts a new book to the database.
router.post('/new', (req, res, next) =>{
  // console.log(req.body);
  Books.create(req.body).then(function() {
    res.redirect("/");
  });

});

// - display a book details in the form based on the ID catch from the url.
router.get('/:id', (req, res, next)=>{
  Books.findAll({
    where: {
      id: req.params.id
    },
    raw: true,
  }).then((book) => {
    // console.log(book[0]);
    res.render('update-book',{book:book[0], pageTitle:"Update Book"});
  })
});

//- Updates book info in the database.
router.post('/:id', function(req, res, next){
  Books.findByPk(req.params.id)
  .then(function(book) {
    return book.update(req.body);
  })
  .then(function(){
    res.redirect("/");    
  });
});


//- Deletes a book. Careful, this can’t be undone. It can be helpful to create a new “test” book to test deleting.
router.delete('/:id/delete', (req, res, next) =>{
  Books.findByPk(req.params.id)
  .then((book)=>{
    book.destroy();
  })
  .then(()=>{
    res.redirect('/');
  })
});

module.exports = router;
