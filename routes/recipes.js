var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");
const DButils = require("../routes/utils/DButils");


router.get("/", (req, res) => res.send("im here"));

/**
 * This path returns a full details of a recipe by its id
 */
router.get("/:recipeId", async (req, res, next) => {
  try {
    if(req.session.user_id){
      const user_id = req.session.user_id;
      const recipe_id = req.params.recipeId;
      const recipes = await DButils.execQuery("SELECT id FROM newrecipes");
      if (recipes.find((x) => x.id == recipe_id)) {
        const ids = await DButils.execQuery(`SELECT * FROM userrecipes WHERE user_id=${user_id} AND recipe_id=${recipe_id}`);
        if (ids != null) {
          const recipe = await DButils.execQuery(`SELECT * FROM newrecipes WHERE id=${recipe_id}`);
          res.send(recipe[0]);
          return;
        }
      }
    }
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);
    if(req.session.user_id){
      const user_id = req.session.user_id;
      await DButils.execQuery(
        `INSERT INTO watchedrecipes VALUES ('${user_id}','${recipe.id}')`
      );
    }
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});


/**
 * This path returns a 5-10/15 (default is 5) recipes by query
 * In the API its "GET/recipes/{query}" - TODO: talk about it
 */
 router.get("/search/:query_from_user-:number", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipesByQuery(req.params.query_from_user,req.params.number);
    
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

/**
 * POST/createrecipe
 * input:
  "recipe picture": "string",
  "recipe name": string,
  "time of preparation": string or date or what ?,
  "recipe popularity": frontend ? or what? maybe remove it and fill with 1 or 0 ?,
  "vegan: boolean or yes/no ? ",
  "vegetarian": boolean or yes/no ? ",
  "gluten free": boolean or yes/no ? ",
  "has been seen": apear on API as True - so need to add to DB,
  "has been saved": apear on API as False,
  "recips product list and quantities": string??? apear on API : "3 bananas , 2 apples , 1 glass of water.",
  "recipe instructions": string?? "Cut the bananas , Cut the apples , Pour the glass of water, Mix everything togerer.",
  "number of dishes": 4
}
 */
router.post("/createrecipe", async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    /**
     * user must be connected !!! how can we check it ?
     */
    
    // await user_utils.createRecipe(req.params.recipe_pic,req.params.recipe_name,req.params.time_of_preparation,req.params.vegan,req.params.vagetarian,req.params.gluten_free,req.params.product_list_and_quantities,req.params.number_of_dishes);
    //or
    // await recipes_utils.createRecipe(req.params.recipe_pic,req.params.recipe_name,req.params.time_of_preparation,req.params.vegan,req.params.vagetarian,req.params.gluten_free,req.params.product_list_and_quantities,req.params.number_of_dishes);

    let recipe_details = {
      id: req.body.id,
      title: req.body.title,
      readyInMinutes: req.body.readyInMinutes,
      image: req.body.image,
      popularity: req.body.popularity,
      vegan: req.body.vegan,
      vegetarian: req.body.vegetarian,
      glutenFree: req.body.glutenFree,
      instructions: req.body.instructions,
      number_of_dishes: req.body.number_of_dishes
    }

    const recipe = await DButils.execQuery("SELECT id FROM newrecipes");
    //console.log(users)
    if (recipe.find((x) => x.id == recipe_details.id))
      throw { status: 409, message: "id is taken" };

    await DButils.execQuery(
      `INSERT INTO newrecipes VALUES ('${recipe_details.id}','${recipe_details.title}', '${recipe_details.readyInMinutes}', '${recipe_details.image}',
      '${recipe_details.popularity}', '${recipe_details.vegan}', '${recipe_details.vegetarian}' , '${recipe_details.glutenFree}', '${recipe_details.instructions}','${recipe_details.number_of_dishes}')`
    );
    try{
      await DButils.execQuery(
        `INSERT INTO userrecipes VALUES ('${user_id}','${recipe_details.id}')`
      );
    } catch {
      console.log("Recipe created but didn't connect to user")
    }
    res.status(200).send({message: "The Recipe successfully created", success: true});
  } catch(error){
    next(error);
  }
});

// /**
// @todo update our API - move this from recipe to user(on our API!!!)
//  * GET/favorites
//  * page with information about all the favorites recipes of the user.
//  * Shows all the recipes that the connected user has saved in his favorites
//  * No parameters
//  * but need to check if user connected
//  * 
//  * This path returns a full information about all the favorites recipes of the user( by its id ?? or how ??)
//  */
//  router.get("/:favorites", async (req, res, next) => {
//   try {
//     const user_id = req.session.user_id;
//     const favorite_recipes = await user_utils.getFavoriteRecipes(user_id);
//     res.send(favorite_recipes);
//   } catch (error) {
//     next(error);
//   }
// });


/**
 * This path returns the "family recipes" that were saved by the logged-in user
 * 
 * GET /family page with information about all the family recipes of the connected user.
 * 
 * Shows all the family recipes that belongs to the connected user.
 * - recipe belongs to.
 * - When it is customary to prepare it.
 * - recips product list and quantities. - recipe instructions.
 * 
 * @todo update our API? - maybe we need to move this from recipe to user ???
 */



//***************************************************************** */
//  router.get('/family', async (req,res,next) => {
//   try{
//     const user_id = req.session.user_id;
//     let family_recipes = {};/** @todo that from the template - but I think its an error because nobody use this var */
//     const recipes_id = await user_utils.getFamilyRecipes(user_id);
//     let recipes_id_array = [];
//     recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
//     const results = await recipe_utils.getRecipesPreview(recipes_id_array);
//     res.status(200).send(results);
//   } catch(error){
//     next(error); 
//   }
// });
//******************************************************************** */

/**
 * 
 * 
 * e.g http://localhost:3000/recipes/recipes_preview/716411,716429,715000,5665
 * return :
 * [
    {
        "id": 716411,
        "title": "Snickerdoodle Ice Cream",
        "readyInMinutes": 45,
        "image": "https://spoonacular.com/recipeImages/716411-556x370.jpg",
        "popularity": 215,
        "vegan": false,
        "vegetarian": true,
        "glutenFree": true
    },
    {
        "id": 716429,
        "title": "Pasta with Garlic, Scallions, Cauliflower & Breadcrumbs",
        "readyInMinutes": 45,
        "image": "https://spoonacular.com/recipeImages/716429-556x370.jpg",
        "popularity": 209,
        "vegan": false,
        "vegetarian": false,
        "glutenFree": false
    },
    {
        "id": 715000,
        "title": "Peanut butter chocolate oatmeal smoothie",
        "readyInMinutes": 5,
        "popularity": 0,
        "vegan": false,
        "vegetarian": true,
        "glutenFree": true
    },
    {
        "id": 5665,
        "title": "Shrimp with Lemon-Saffron Rice",
        "readyInMinutes": 45,
        "image": "https://spoonacular.com/recipeImages/5665-556x370.jpg",
        "popularity": 0,
        "vegan": false,
        "vegetarian": false,
        "glutenFree": true
    }
]





 * function for developers and private tests, we can check here recipes_utils.getRecipesPreview


* soryBy can be popularity,readyInMinutes or nothing !!!
 */
router.get('/recipes_preview/:recipes_ids_separated_by_comma-:sortBy', async(req,res,next) => {
  try{
    // let str = req.params.recipes_ids_separated_by_comma;
    // const ids_arr = str.split(/[,]+/);
    const ids_arr = req.params.recipes_ids_separated_by_comma;
    const sortByKey = req.params.sortBy
    if (sortByKey.length==0) {
      sortByKey = false;
    }
    const results = await recipes_utils.getRecipesPreview(ids_arr,sortByKey);
    res.status(200).send(results);
  } catch(error){
    next(error);
  }
});

module.exports = router;
