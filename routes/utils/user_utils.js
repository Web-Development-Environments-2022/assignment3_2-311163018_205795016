const DButils = require("./DButils");

async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`insert into FavoriteRecipes values ('${user_id}',${recipe_id})`);
}

async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from favoriterecipes where user_id='${user_id}'`);
    return recipes_id;
}

/**
 * My recipes
 * @param {*} user_id 
 * @param {*} recipe_id 
 */
async function markAsMyRecipe(user_id, recipe_id){
    await DButils.execQuery(`insert into UserRecipes values ('${user_id}',${recipe_id})`);
}

async function getUserMyRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from UserRecipes where user_id='${user_id}'`);
    return recipes_id;
}


/**
 * @todo - add table " FamilyRecipes " to DB
 * 
 * @param {*} user_id 
 * @returns 
 */
 async function getFamilyRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from FamilyRecipes where user_id='${user_id}'`);
    return recipes_id;
}







exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.markAsMyRecipe = markAsMyRecipe;
exports.getUserMyRecipes = getUserMyRecipes;
exports.getFamilyRecipes = getFamilyRecipes;
