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


// - POST A NEW BOOK TO THE DATABASE

router.post('/new', (req, res, next) =>{
  Books.create(req.body) 
  .then(function() {
    res.redirect("/");
  })
  .catch((err)=>{
    if(err.name === "SequelizeValidationError"){ // RENDER THE FORM PAGE WITH AN ERROR MESSAGE IF THE ERROR CATCHED IS EQUAL TO "SequelizeValidationError"
      // Render the same form and pass the error as a parameter
      // res.json(err);
      res.render('new-book',
       {
        book:Books.build(req.body),
        pageTitle:"New Book",
        errors:err.errors
      });
    } else {// IF THE ERROR CATCH IS NOT EQUAL TO "SequelizeValidationError" THE FUNCTION WILL JUST THROW AN ERROR THAT THE NEXT CATCH FUNCTION WILL CATCH
      throw err
    }
  })
  .catch((err)=>{
    res.send(500);
  });
  
});

// - DISPLAYS A BOOK DETAILS IN THE FORM BASED ON THE ID CATCH FROM THE URL
router.get('/:id', (req, res, next)=>{
  Books.findAll({
    where: {
      id: req.params.id
    },
    raw: true,
  })
  .then((book) => {
    if(book.length!==0){
      res.render('update-book',{book:book[0], pageTitle:"Update Book"});
      } else if(book.length==0){
      res.render('page-not-found')
      }
  });

});



//- UPDATES THE SELECTED BOOK ROW FROM THE BOOKS DATABASE
router.post('/:id', function(req, res, next){
  Books.findByPk(req.params.id)
  .then(function(book) {
      return book.update(req.body);
  })

  .then(function(){
    res.redirect("/");    
  })
});

//  SEARCH FUNCTION BASED ON TITLE, GENRE, AUTHOR AND YEAR



//- Deletes a book. Careful, this can’t be undone. It can be helpful to create a new “test” book to test deleting.

router.post('/:id/delete', function (req, res, next) {
  console.log('testing the delete request');
 Books.findByPk(req.params.id)
 .then( function(book){
   console.log(book);
    return book.destroy();
  }).then((book) => {
    console.log(book);
    res.redirect('/');
  }).catch(function(err){
    res.send(500);
  });
});


module.exports = router;
