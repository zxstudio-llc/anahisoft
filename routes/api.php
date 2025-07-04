<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use LaravelJsonApi\Laravel\Facades\JsonApiRoute;
use LaravelJsonApi\Laravel\Http\Controllers\JsonApiController;
use LaravelJsonApi\Laravel\Routing\ResourceRegistrar;
use App\Http\Controllers\Api\V1\Sri\SriController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

//json api routes

JsonApiRoute::server('v1')
    ->domain(config('app.server_domain'))
    ->prefix('v1')
    ->resources(function ($server) {
        $server->resource('sris', SriController::class)
            ->only('search')
            ->parameter('sris', 'identification')
            ->actions(function ($actions) {
                $actions->post('search', 'search');
            });
    });