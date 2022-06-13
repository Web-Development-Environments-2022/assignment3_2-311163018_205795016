var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");
const home_utils = require("./utils/mainPage_utils")



// return three random recipes
router.get("/", async (req, res, next) => {
    try {
        const randomRecipes = await home_utils.getRandomRecipes();
        if(req.session.user_id){
          const user_id = req.session.user_id;
          let my_recipes = {};/**@todo that from the template - but I think its an error because nobody use this var*/
          const recipes_id = await user_utils.getUserWatchedRecipes(user_id);

          let recipes_id_array = [];
          recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array

          if (recipes_id_array.length > 3){
            // 
            sliced_arry = recipes_id_array.slice(-3)
            const favorite_recipes_id_string_by_comma = sliced_arry.join();
            const results = await recipe_utils.getRecipesPreview(favorite_recipes_id_string_by_comma);
            //const results = await recipe_utils.getRecipesPreview(recipes_id_array.slice(-3));
            res.send(results);
          }
          else if(recipes_id_array.length == 0){
            res.send(randomRecipes.data);

          }
          else{
            const favorite_recipes_id_string_by_comma = recipes_id_array.join();
            const results = await recipe_utils.getRecipesPreview(favorite_recipes_id_string_by_comma);

  
            res.status(200).send(results);
          }
        }
        else{

          res.send(randomRecipes.data);
        }
        //res.send(randomRecipes.data);
        //res.status(200).send(results);
      } catch (error) {
        next(error);
      }
});


module.exports = router;
