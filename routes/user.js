var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT ID FROM users").then((users) => {
      if (users.find((x) => x.ID === req.session.user_id)) {
        req.user_id = req.session.user_id;
        next();
      }
    }).catch(err => next(err));
  } else {
    res.sendStatus(401);
  }
});


/**
 * This path gets body with recipeId and save this recipe in the favorites list of the logged-in user
 * 
 * @todo update our API - move this from recipe to uset(on our API!!!)
 */
router.post('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    await user_utils.markAsFavorite(user_id,recipe_id);
    res.status(200).send("The Recipe successfully saved as favorite");
    } catch(error){
    next(error);
  }
})

/**
 * This path returns the favorites recipes that were saved by the logged-in user
 * 
 * 
 * @todo update our API - move this from recipe to uset(on our API!!!)
 */
router.get('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    let favorite_recipes = {};//that from the template - but I think its an error because nobody use this var
    const recipes_id = await user_utils.getFavoriteRecipes(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
// recipes_id_array is an array of recipes id seperated by comma (",")), we need to convert it to string' that the reason for this stranger line below ;-) 
    const favorite_recipes_id_string_by_comma = recipes_id_array.join();
    const results = await recipe_utils.getRecipesPreview(favorite_recipes_id_string_by_comma);
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});



/**
 * This path returns the "My recipes" that were saved by the logged-in user
 * 
 * 
 * @todo update our API - move this from recipe to user(on our API!!!)
 */
 router.get('/myrecipes', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    let my_recipes = {};/**@todo that from the template - but I think its an error because nobody use this var*/
    const recipes_id = await user_utils.getUserMyRecipes(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    const results = await recipe_utils.getMyRecipesPreview(recipes_id_array);
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});

/**
 * This path gets body with recipeId and save this recipe in the favorites list of the logged-in user
 * 
 * 
 * @todo update our API - move this from recipe to user(on our API!!!)
 */
 router.post('/myrecipes', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    await user_utils.markAsMyRecipe(user_id,recipe_id);
    res.status(200).send("The Recipe successfully saved in My recipes");
    } catch(error){
    next(error);
  }
})


module.exports = router;
