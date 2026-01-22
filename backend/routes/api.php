<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;

// Products API routes
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/featured', [ProductController::class, 'featured']);
Route::get('/products/ios', [ProductController::class, 'ios']);
Route::get('/products/android', [ProductController::class, 'android']);
Route::get('/products/search', [ProductController::class, 'search']);
Route::get('/products/{id}', [ProductController::class, 'show']);

// Categories API routes
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);

// Brands API routes
Route::get('/brands', [BrandController::class, 'index']);
Route::get('/brands/{id}', [BrandController::class, 'show']);

// Reviews API routes
Route::get('/products/{id}/reviews', [ReviewController::class, 'index']);
Route::post('/products/{id}/reviews', [ReviewController::class, 'store']);

// Auth API routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Cart API routes (auth required)
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart/add', [CartController::class, 'add']);
    Route::put('/cart/update', [CartController::class, 'update']);
    Route::delete('/cart/remove/{itemId}', [CartController::class, 'remove']);
    Route::post('/cart/clear', [CartController::class, 'clear']);

    // Order API routes (auth required)
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::post('/orders', [OrderController::class, 'store']);
});

// Admin API routes (admin middleware required)
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    // Products CRUD
    Route::get('/products', [ProductController::class, 'adminIndex']); // List all products (admin)
    Route::post('/products', [ProductController::class, 'store']); // Create product
    Route::put('/products/{id}', [ProductController::class, 'update']); // Update product
    Route::delete('/products/{id}', [ProductController::class, 'destroy']); // Delete product

    // Categories CRUD
    Route::get('/categories', [CategoryController::class, 'adminIndex']); // List all categories (admin)
    Route::post('/categories', [CategoryController::class, 'store']); // Create category
    Route::put('/categories/{id}', [CategoryController::class, 'update']); // Update category
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']); // Delete category

    // Brands CRUD
    Route::get('/brands', [BrandController::class, 'adminIndex']); // List all brands (admin)
    Route::post('/brands', [BrandController::class, 'store']); // Create brand
    Route::put('/brands/{id}', [BrandController::class, 'update']); // Update brand
    Route::delete('/brands/{id}', [BrandController::class, 'destroy']); // Delete brand

    // Orders CRUD
    Route::get('/orders', [OrderController::class, 'adminIndex']); // List all orders (admin)
    Route::get('/orders/{id}', [OrderController::class, 'adminShow']); // Show order details (admin)
    Route::put('/orders/{id}', [OrderController::class, 'adminUpdate']); // Update order status/details
    Route::delete('/orders/{id}', [OrderController::class, 'adminDestroy']); // Delete/cancel order
});
