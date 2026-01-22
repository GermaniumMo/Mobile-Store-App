<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Example: Add 3 reviews per product
        $products = \App\Models\Product::all();
        foreach ($products as $product) {
            for ($i = 1; $i <= 3; $i++) {
                \App\Models\Review::create([
                    'product_id' => $product->id,
                    'user_name' => 'User ' . $i,
                    'rating' => rand(3, 5),
                    'comment' => 'This is a review for ' . $product->name,
                ]);
            }
        }
    }
}
