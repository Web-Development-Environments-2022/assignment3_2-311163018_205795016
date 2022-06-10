const DButils = require("./DButils");

async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`insert into FavoriteRecipes values ('${user_id}',${recipe_id})`);
}

async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from FavoriteRecipes where user_id='${user_id}'`);
    return recipes_id;
}


async function markAsMyRecipe(user_id, recipe_id){
    await DButils.execQuery(`insert into UserRecipes values ('${user_id}',${recipe_id})`);
}

async function getUserMyRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from UserRecipes where user_id='${user_id}'`);
    return recipes_id;
}




exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.markAsMyRecipe = markAsMyRecipe;
exports.getUserMyRecipes = getUserMyRecipes;
