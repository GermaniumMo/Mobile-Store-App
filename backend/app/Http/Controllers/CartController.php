<?php
namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    // Get the authenticated user's cart
    public function index(Request $request)
    {
        $cart = $request->user()->cart()->with('items.product')->firstOrCreate([]);
        return response()->json($cart->load('items.product'));
    }

    // Add product to cart
    public function add(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);
        $cart = $request->user()->cart()->firstOrCreate([]);
        $item = $cart->items()->where('product_id', $validated['product_id'])->first();
        if ($item) {
            $item->quantity += $validated['quantity'];
            $item->save();
        } else {
            $product = Product::find($validated['product_id']);
            $cart->items()->create([
                'product_id' => $product->id,
                'quantity' => $validated['quantity'],
                'price' => $product->price,
            ]);
        }
        return response()->json($cart->load('items.product'));
    }

    // Update cart item quantity
    public function update(Request $request)
    {
        $validated = $request->validate([
            'item_id' => 'required|exists:cart_items,id',
            'quantity' => 'required|integer|min:1',
        ]);
        $item = CartItem::find($validated['item_id']);
        $item->quantity = $validated['quantity'];
        $item->save();
        return response()->json($item->cart->load('items.product'));
    }

    // Remove item from cart
    public function remove($itemId)
    {
        $item = CartItem::findOrFail($itemId);
        $cart = $item->cart;
        $item->delete();
        return response()->json($cart->load('items.product'));
    }

    // Clear the cart
    public function clear(Request $request)
    {
        $cart = $request->user()->cart;
        if ($cart) {
            $cart->items()->delete();
        }
        return response()->json(['message' => 'Cart cleared']);
    }
}
