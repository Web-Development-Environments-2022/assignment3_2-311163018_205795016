var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");
const home_utils = require("./utils/mainPage_utils")



/**
 * return array of 2 arrays : [[3 random recipes from spooncular API],[last 3(maximum) recipes that the user watched (if there is no user connected - this array will be empty)]]
 */
router.get("/", async (req, res, next) => {
    try {
        //randomRecipes - 3 random recipes from spooncular API
        const randomRecipes = await recipe_utils.getRandomRecipesPreview();//home_utils.getRandomRecipes();
        const results = [];
        results.push(randomRecipes);
        let recipes_id_array = [];
        if(req.session.user_id != null){
          const user_id = req.session.user_id;
          let my_recipes = {};/**@todo that from the template - but I think its an error because nobody use this var*/
          const recipes_id = await user_utils.getUserWatchedRecipes(user_id);

          recipes_id_array = [];
          recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
          //remove duplicates recipes
          let uniqueIds = [...new Set(recipes_id_array)];
          recipes_id_array = Array.from(uniqueIds);
          if (recipes_id_array.length > 3){
            sliced_arry = recipes_id_array.slice(-3)
            const latest_recipes_id_string_by_comma = sliced_arry.reverse().join();
            results.push(await recipe_utils.getRecipesPreview(latest_recipes_id_string_by_comma,false));
          } else if (recipes_id_array.length != 0){
            const latest_recipes_id_string_by_comma = recipes_id_array.reverse().join();
            results.push(await recipe_utils.getRecipesPreview(latest_recipes_id_string_by_comma,false));
          } 
        } else {//no user connect
          results.push(recipes_id_array);
        }
        res.status(200).send(results);
      } catch (error) {
        next(error);
      }
});


module.exports = router;
