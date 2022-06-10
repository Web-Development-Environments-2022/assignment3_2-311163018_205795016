var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");

router.get("/", (req, res) => res.send("im here"));

/**
 * This path returns a full details of a recipe by its id
 */
router.get("/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});


/**
 * This path returns a 5-10/15 (default is 5) recipes by query
 */
 router.get("/search/:query_from_user-:number", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipesByQuery(req.params.query_from_user,req.params.number);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});



module.exports = router;
