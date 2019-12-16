<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();

});


Route::post('auth/register', 'AuthController@register');
Route::post('auth/login', 'AuthController@login');

Route::group(['middleware' => 'jwt.refresh'], function () {
    Route::get('auth/refresh', 'AuthController@refresh');
});

Route::group(['middleware' => 'jwt.auth'], function () {

    Route::post('auth/logout', 'AuthController@logout');

    Route::namespace('Api')->group(function () {

        Route::post('/images/update', 'ImagesController@update');
        Route::post('/images/save', 'ImagesController@save');
        Route::post('/images/destroy', 'ImagesController@destroy');

        Route::post('/cards/destroy/{id}', 'CardsController@destroy');

    });
});

Route::namespace('Api')->group(function () {

    Route::get('/images/', 'ImagesController@index');

    Route::get('/cards/{user}', 'CardsController@index');
    Route::get('/cards/single/{name}', 'CardsController@single');
    Route::post('/cards/show', 'CardsController@show');
    Route::post('/cards/store', 'CardsController@store');

});
