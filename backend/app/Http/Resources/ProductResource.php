<?php
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'sku' => $this->sku,
            'price' => $this->price,
            'discount_price' => $this->discount_price,
            'stock' => $this->stock,
            'platform' => $this->platform,
            'is_featured' => $this->is_featured,
            'is_active' => $this->is_active,
            'rating' => $this->rating,
            'image' => $this->image,
            'primary_image' => $this->images->where('is_primary', true)->first()?->image_url ?? $this->image,
            'gallery_images' => $this->images->pluck('image_url'),
            'brand' => $this->brands->pluck('name'),
            'categories' => $this->categories->pluck('name'),
            'reviews_count' => $this->reviews->count(),
        ];
    }
}
