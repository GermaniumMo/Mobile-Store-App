<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'sku', 'price', 'discount_price', 'image', 'description',
        'platform', 'stock', 'is_featured', 'is_active', 'rating'
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'price' => 'float',
        'discount_price' => 'float',
        'rating' => 'float',
    ];

    public function categories()
    {
        return $this->belongsToMany(Category::class);
    }

    public function brands()
    {
        return $this->belongsToMany(Brand::class);
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
