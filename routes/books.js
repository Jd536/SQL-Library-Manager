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
  .catch((error)=>{
    res.send(500);
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
  })
  .catch((err)=>{
    if(err.name === "SequelizeValidationError"){
      // Render the same form and pass the error as a parameter
      res.render('new-book', {error:err.errors});
    } else {
      throw err;
    }
  })
  .catch((err)=>{
    res.send(500);
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
    if(book){
    res.render('update-book',{book:book[0], pageTitle:"Update Book"});
    } else{
      res.send(404);
    }
  })
  .catch((error)=>{
    res.send(500);
  });
});

//- Updates book info in the database.
router.post('/:id', function(req, res, next){
  Books.findByPk(req.params.id)
  .then(function(book) {
    if(book){
    return book.update(req.body);
    } else{
      res.send(404);
    }
  })
  .then(function(){
    res.redirect("/");    
  })
  .catch((err)=>{
    if(err.name === "SequelizeValidationError"){
           // Render the same form and pass the error as a parameter
           console.log(err);
           res.render('update-book', {error:err.errors});
    } else {
      throw err;
    }
  })
  .catch((err)=>{
    res.send(404)
  });
});


//- Deletes a book. Careful, this can’t be undone. It can be helpful to create a new “test” book to test deleting.

router.post('/:id/delete', (req, res, next)=>{
  Books.findByPk(req.params.id)
    .then((book)=>{
      if(book){
        book.destroy();
      }
      const error = new Error('Server Error.');
      error.status = 500;
      return next(error);
    })
    .then(()=>{ //redirect to the main page
      res.redirect('/')
    })
})

module.exports = router;
