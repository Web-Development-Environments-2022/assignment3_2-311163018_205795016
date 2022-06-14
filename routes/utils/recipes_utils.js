const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";
const DButils = require("./DButils");
const mainPage_utils = require("./mainPage_utils");




/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */


async function getRecipeInformation(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
}

async function getRecipeInformationBulk(recipes_id) {
    return await axios.get(`${api_domain}/informationBulk`, {
        params: {
            ids: recipes_id,
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
}




async function getRecipeDetails(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    try{
        let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree,instructions,servings,extendedIngredients,summary } = recipe_info.data;
        return {
            id: id,
            title: title,
            readyInMinutes: readyInMinutes,
            image: image,
            popularity: aggregateLikes,
            vegan: vegan,
            vegetarian: vegetarian,
            glutenFree: glutenFree,
            instructions: instructions,
            servings : servings ,
            extendedIngredients : extendedIngredients,
            summary : summary ,

            
        }
    } catch {
        let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info.data;
        return {
            id: id,
            title: title,
            readyInMinutes: readyInMinutes,
            image: image,
            popularity: aggregateLikes,
            vegan: vegan,
            vegetarian: vegetarian,
            glutenFree: glutenFree,
         
        }
    }
}



/**
 * Get recipes list from spooncular response 
 * @param {*} recipes_info
 */

async function getRecipesComplexSearch(input_query,input_number) {
    return await axios.get(`${api_domain}/complexSearch`, {
        params: {
            query: input_query,
            number: input_number,
            apiKey: process.env.spooncular_apiKey
        }
    });
}


/**
 * https://spoonacular.com/food-api/docs#Search-Recipes-Complex
 * Search through hundreds of thousands of recipes using advanced filtering and ranking. NOTE: This method combines searching by query, by ingredients, and by nutrients into one endpoint.
 * input:
 *  query- type:string	example:pasta	Description: The (natural language) recipe search query.
 * NUBMER- TYPE:number	EXAMPLE:10	Description:The number of expected results (between 1 and 100).
 */
 async function getRecipesByQuery(query,NumberOfResults) {
    let recipe_info = await getRecipesComplexSearch(query,NumberOfResults);
    let { offset, number, results ,totalResults} = recipe_info.data;
    if (results.length == 0) {
        let str = "No recipes found ";
        return str;
    }
    return {
        offset : offset,
        number : number,
        results : results,
        totalResults : totalResults,
        
    }
}


/**
 * but what about family recipes??? getRecipeInformation search only in spoonacular
 * @param {*} recipes_id_arr 
 */
async function getRecipesPreview(recipes_id_arr,keyToSort) {
    // let number_of_recipes = recipes_id_arr.length;
    let recipes_preview_array = [];
    let recipe_info = await getRecipeInformationBulk(recipes_id_arr);
    recipes_preview_array = recipe_info.data;
    final_recipes_preview_array =[];
    let number_of_recipes = recipes_preview_array.length;
    for (let i=0;i<number_of_recipes; i++) {
        // let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipes_preview_array[i];
            //not sure if we want to add recipe ID, or maybe its need to be client problem ?
        try{
            let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree,instructions } = recipes_preview_array[i];
            final_recipes_preview_array.push({
            id: id,
            title: title,
            readyInMinutes: readyInMinutes,
            image: image,
            popularity: aggregateLikes,
            vegan: vegan,
            vegetarian: vegetarian,
            glutenFree: glutenFree,
            instructions: instructions,
        })
        } catch {
            let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipes_preview_array[i];
            final_recipes_preview_array.push({
                id: id,
                title: title,
                readyInMinutes: readyInMinutes,
                image: image,
                popularity: aggregateLikes,
                vegan: vegan,
                vegetarian: vegetarian,
                glutenFree: glutenFree,
            })
        }

    }
    if (keyToSort == false) {
        return final_recipes_preview_array;
    }
    return SortByKey(final_recipes_preview_array,keyToSort);
}




/**
 * make preview to recipes that on OUR DB (in the table newrecipes)
 * @param {*} recipes_id_arr 
 * @param {*} keyToSort 
 * @returns 
 */
async function getMyRecipesPreview(recipes_id_arr,keyToSort) {
    // let number_of_recipes = recipes_id_arr.length;
    let recipes_preview_array = [];
    for (let i=0;i<recipes_id_arr.length;i++) {
        let recipe_info = await DButils.execQuery(`select * from newrecipes where id='${recipes_id_arr[i]}'`);
        //JSON.stringify(recipe_info) - convert "RowDataPacket" to js object
        let string_obj = JSON.stringify(recipe_info);
        //JSON.parse(string_obj) convert it to array that in index 0 the row we want exists
        recipes_preview_array.push(JSON.parse(string_obj)[0]);
    }
    final_recipes_preview_array =[];
    let number_of_recipes = recipes_preview_array.length;
    for (let i=0;i<number_of_recipes; i++) {
        // let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipes_preview_array[i];
            //not sure if we want to add recipe ID, or maybe its need to be client problem ?
        try{
            let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree,instructions } = recipes_preview_array[i];
            final_recipes_preview_array.push({
            id: id,
            title: title,
            readyInMinutes: readyInMinutes,
            image: image,
            popularity: aggregateLikes,
            vegan: vegan,
            vegetarian: vegetarian,
            glutenFree: glutenFree,
            instructions: instructions,
        })
        } catch {
            let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipes_preview_array[i];
            final_recipes_preview_array.push({
                id: id,
                title: title,
                readyInMinutes: readyInMinutes,
                image: image,
                popularity: aggregateLikes,
                vegan: vegan,
                vegetarian: vegetarian,
                glutenFree: glutenFree,
            })
        }

    }
    if (keyToSort == null) {
        return final_recipes_preview_array;
    }
    return SortByKey(final_recipes_preview_array,keyToSort);
}


async function getRandomRecipesPreview(keyToSort) {
    let recipes_preview_array = [];
    let recipe_info = await mainPage_utils.getRandomRecipes();
    recipes_preview_array = recipe_info.data.recipes;
    final_recipes_preview_array =[];
    let number_of_recipes = recipes_preview_array.length;
    for (let i=0;i<number_of_recipes; i++) {
        // let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipes_preview_array[i];
            //not sure if we want to add recipe ID, or maybe its need to be client problem ?
        try{
            let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree,instructions } = recipes_preview_array[i];
            final_recipes_preview_array.push({
            id: id,
            title: title,
            readyInMinutes: readyInMinutes,
            image: image,
            popularity: aggregateLikes,
            vegan: vegan,
            vegetarian: vegetarian,
            glutenFree: glutenFree,
            instructions: instructions,
        })
        } catch {
            let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipes_preview_array[i];
            final_recipes_preview_array.push({
                id: id,
                title: title,
                readyInMinutes: readyInMinutes,
                image: image,
                popularity: aggregateLikes,
                vegan: vegan,
                vegetarian: vegetarian,
                glutenFree: glutenFree,
            })
        }

    }
    /**
     * option to sort by by "readyInMinutes" or by "popularity"
     */
    if (keyToSort == null) {
        return final_recipes_preview_array;
    }
    return SortByKey(final_recipes_preview_array,keyToSort);
}


/**
 * make preview to recipes that on OUR DB (in the table newrecipes)
 * @param {*} recipes_id_arr 
 * @param {*} keyToSort 
 * @returns 
 */
 async function getFamilyRecipesPreview(recipes_id_arr,user_id,keyToSort) {
    // let number_of_recipes = recipes_id_arr.length;
    let recipes_preview_array = [];
    for (let i=0;i<recipes_id_arr.length;i++) {
        let recipe_info = await DButils.execQuery(`select * from familyrecipes where (recipe_id='${recipes_id_arr[i]}') AND (user_id='${user_id}')`);
        //JSON.stringify(recipe_info) - convert "RowDataPacket" to js object
        let string_obj = JSON.stringify(recipe_info);
        //JSON.parse(string_obj) convert it to array that in index 0 the row we want exists
        recipes_preview_array.push(JSON.parse(string_obj)[0]);
    }
    final_recipes_preview_array =[];

    recipes_preview_array = recipes_preview_array.filter(function( element ) {
        return element !== undefined;
     });

    //console.log(typeof recipes_preview_array)
    let number_of_recipes = recipes_preview_array.length;

    for (let i=0;i<number_of_recipes; i++) {
        // let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipes_preview_array[i];
            //not sure if we want to add recipe ID, or maybe its need to be client problem ?
        try{
            let { recipe_id, title,recipe_belongs_to,makes_it_in, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree,ingredients,instructions } = recipes_preview_array[i];
            final_recipes_preview_array.push({
            recipe_id: recipe_id,
            title: title,
            recipe_belongs_to: recipe_belongs_to,
            makes_it_in: makes_it_in,
            readyInMinutes: readyInMinutes,
            image: image,
            popularity: aggregateLikes,
            vegan: vegan,
            vegetarian: vegetarian,
            glutenFree: glutenFree,
            ingredients: ingredients,
            instructions: instructions,
        })
        } catch {
            let { recipe_id, title,recipe_belongs_to,makes_it_in, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipes_preview_array[i];
            final_recipes_preview_array.push({
                recipe_id: recipe_id,
                title: title,
                readyInMinutes: readyInMinutes,
                recipe_belongs_to: recipe_belongs_to,
                makes_it_in: makes_it_in,
                image: image,
                popularity: aggregateLikes,
                vegan: vegan,
                vegetarian: vegetarian,
                glutenFree: glutenFree,
            })
        }

    }
    if (keyToSort == null) {
        return final_recipes_preview_array;
    }
    return SortByKey(final_recipes_preview_array,keyToSort);
}


/**
 * function that sort array of object (which represent recipe ) by "readyInMinutes" or by "popularity"
 * @param {*} array_to_sort 
 * @param {*} the_key 
 * @returns 
 */
function SortByKey(array_to_sort,the_key) {
    if (the_key == "readyInMinutes"){
        try {
            array_to_sort.sort(function(a,b) {
                return a.readyInMinutes - b.readyInMinutes
            })
        } catch {
            console.log("sort by readyInMinutes Failed - return unsorted list of recipes")
            return array_to_sort;
        }
    } else {
        try {
            array_to_sort.sort(function(a,b) {
                return a.popularity - b.popularity
            })
        } catch {
            console.log("sort by popularity Failed - return unsorted list of recipes")
            return array_to_sort;
        }        
    }
    return array_to_sort;
}

exports.getRecipeDetails = getRecipeDetails;
exports.getRecipesByQuery = getRecipesByQuery;
exports.getRecipesPreview = getRecipesPreview;
exports.getMyRecipesPreview = getMyRecipesPreview;
exports.getRandomRecipesPreview = getRandomRecipesPreview;
exports.getFamilyRecipesPreview = getFamilyRecipesPreview;


