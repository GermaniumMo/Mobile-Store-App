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
}
