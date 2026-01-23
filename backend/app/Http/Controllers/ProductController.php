<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

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

    // Admin: List all products (without pagination limit for admin)
    public function adminIndex(Request $request)
    {
        $query = Product::query()->with(['categories', 'brands', 'images']);
        $products = $query->latest()->get();
        return response()->json(['data' => $products]);
    }

    // Admin: Create product
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'sku' => 'required|string|unique:products',
                'price' => 'required|numeric|min:0',
                'discount_price' => 'nullable|numeric|min:0',
                'description' => 'nullable|string',
                'platform' => 'required|in:ios,android',
                'stock' => 'required|integer|min:0',
                'image' => 'nullable|string|max:2048',
                'is_featured' => 'boolean',
                'is_active' => 'boolean',
                'rating' => 'nullable|numeric|min:0|max:5',
            ]);

            // If image is a base64 or data URL, process it
            if ($validated['image'] && strpos($validated['image'], 'data:') === 0) {
                $validated['image'] = $this->handleBase64Image($validated['image']);
            } elseif ($validated['image'] && strpos($validated['image'], 'file://') === 0) {
                // If it's a file URI from mobile, we'll keep it as is (it will be converted by frontend)
                $validated['image'] = null; // For now, set to null and let frontend handle upload separately
            }

            $product = Product::create($validated);
            return response()->json(['data' => $product], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validation error', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Product create error:', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Failed to create product', 'error' => $e->getMessage()], 500);
        }
    }

    private function handleBase64Image($imageData)
    {
        try {
            $image = str_replace('data:image/jpeg;base64,', '', $imageData);
            $image = str_replace('data:image/png;base64,', '', $image);
            $image = str_replace(' ', '+', $image);

            $imageName = 'products/' . uniqid() . '.jpg';
            Storage::disk('public')->put($imageName, base64_decode($image));

            return '/storage/' . $imageName;
        } catch (\Exception $e) {
            Log::error('Image processing error:', ['error' => $e->getMessage()]);
            return null;
        }
    }

    // Admin: Update product
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'sku' => 'sometimes|string|unique:products,sku,' . $id,
            'price' => 'sometimes|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
            'platform' => 'sometimes|in:ios,android',
            'stock' => 'sometimes|integer|min:0',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'rating' => 'nullable|numeric|min:0|max:5',
        ]);

        $product->update($validated);
        return response()->json(['data' => $product, 'message' => 'Product updated successfully']);
    }

    // Admin: Delete product
    public function destroy($id)
    {
        try {
            $product = Product::findOrFail($id);

            // Delete related images first (if not cascade)
            if ($product->images) {
                $product->images()->delete();
            }

            // Delete related reviews first (if not cascade)
            if ($product->reviews) {
                $product->reviews()->delete();
            }

            // Delete related cart items
            \App\Models\CartItem::where('product_id', $id)->delete();

            // Delete the product (order_items will cascade delete automatically)
            $product->delete();

            return response()->json(['message' => 'Product deleted successfully'], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Product not found'], 404);
        } catch (\Exception $e) {
            Log::error('Product delete error:', ['id' => $id, 'error' => $e->getMessage()]);
            return response()->json(['message' => 'Failed to delete product', 'error' => $e->getMessage()], 500);
        }
    }
}
