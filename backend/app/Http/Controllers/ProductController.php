<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // Paginated list with filters
    public function index(Request $request)
    {
        $query = Product::query()->with(['categories', 'brands', 'images', 'reviews']);
        if ($request->has('platform')) {
            $query->where('platform', $request->platform);
        }
        if ($request->has('featured')) {
            $query->where('is_featured', true);
        }
        if ($request->has('active')) {
            $query->where('is_active', true);
        }
        $products = $query->paginate(12);
        return \App\Http\Resources\ProductResource::collection($products);
    }

    public function featured()
    {
        $products = Product::where('is_featured', true)->with(['categories', 'brands', 'images', 'reviews'])->paginate(12);
        return \App\Http\Resources\ProductResource::collection($products);
    }

    // Return only iOS products
    public function ios()
    {
        $products = Product::where('platform', 'ios')->with(['categories', 'brands', 'images', 'reviews'])->paginate(12);
        return \App\Http\Resources\ProductResource::collection($products);
    }

    // Return only Android products
    public function android()
    {
        $products = Product::where('platform', 'android')->with(['categories', 'brands', 'images', 'reviews'])->paginate(12);
        return \App\Http\Resources\ProductResource::collection($products);
    }

    // Return product by ID
    public function show($id)
    {
        $product = Product::with(['categories', 'brands', 'images', 'reviews'])->find($id);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }
        return new \App\Http\Resources\ProductResource($product);
    }

    public function search(Request $request)
    {
        $query = Product::query()->with(['categories', 'brands', 'images', 'reviews']);
        if ($request->has('q')) {
            $q = $request->q;
            $query->where(function($sub) use ($q) {
                $sub->where('name', 'like', "%$q%")
                    ->orWhere('sku', 'like', "%$q%")
                    ->orWhereHas('brands', function($b) use ($q) {
                        $b->where('name', 'like', "%$q%")
                            ->orWhere('logo', 'like', "%$q%");
                    });
            });
        }
        $products = $query->paginate(12);
        return \App\Http\Resources\ProductResource::collection($products);
    }
}
