<?php
namespace App\Http\Controllers;

use App\Models\Brand;
use Illuminate\Http\Request;
use App\Http\Resources\BrandResource;

class BrandController extends Controller
{
    public function index()
    {
        $brands = Brand::with('products')->get();
        return BrandResource::collection($brands);
    }

    public function show($id)
    {
        $brand = Brand::with('products')->find($id);
        if (!$brand) {
            return response()->json(['message' => 'Brand not found'], 404);
        }
        return new BrandResource($brand);
    }

    // Admin: List all brands
    public function adminIndex()
    {
        $brands = Brand::all();
        return response()->json(['data' => $brands]);
    }

    // Admin: Create brand
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'logo' => 'nullable|string',
        ]);

        $brand = Brand::create($validated);
        return response()->json(['data' => $brand], 201);
    }

    // Admin: Update brand
    public function update(Request $request, $id)
    {
        $brand = Brand::findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'logo' => 'nullable|string',
        ]);

        $brand->update($validated);
        return response()->json(['data' => $brand, 'message' => 'Brand updated successfully']);
    }

    // Admin: Delete brand
    public function destroy($id)
    {
        $brand = Brand::findOrFail($id);
        $brand->delete();
        return response()->json(['message' => 'Brand deleted successfully']);
    }}
