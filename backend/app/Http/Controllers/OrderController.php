<?php
namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    // List all orders for the authenticated user
    public function index(Request $request)
    {
        $orders = $request->user()->orders()->with('items.product')->latest()->paginate(10);
        return response()->json($orders);
    }

    // Show a specific order
    public function show(Request $request, $id)
    {
        $order = $request->user()->orders()->with('items.product')->findOrFail($id);
        return response()->json($order);
    }

    // Create a new order from the user's cart
    public function store(Request $request)
    {
        $user = $request->user();
        $cart = $user->cart()->with('items.product')->first();
        if (!$cart || $cart->items->isEmpty()) {
            return response()->json(['message' => 'Cart is empty'], 422);
        }
        DB::beginTransaction();
        try {
            $total = $cart->items->sum(function($item) { return $item->quantity * $item->price; });
            $order = $user->orders()->create([
                'total' => $total,
                'status' => 'pending',
            ]);
            foreach ($cart->items as $item) {
                $order->items()->create([
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                ]);
            }
            $cart->items()->delete();
            DB::commit();
            return response()->json($order->load('items.product'), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Order creation failed', 'error' => $e->getMessage()], 500);
        }
    }

    // Admin: List all orders
    public function adminIndex()
    {
        $orders = Order::with('user', 'items.product')->latest()->get();
        return response()->json(['data' => $orders]);
    }

    // Admin: Show specific order details
    public function adminShow($id)
    {
        $order = Order::with('user', 'items.product')->findOrFail($id);
        return response()->json(['data' => $order]);
    }

    // Admin: Update order
    public function adminUpdate(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        $validated = $request->validate([
        'status' => 'required|in:pending,processing,paid,shipped,delivered,completed,cancelled',
    ]);
        $order->update($validated);
        return response()->json(['data' => $order, 'message' => 'Order updated successfully']);
    }

    // Admin: Delete order
    public function adminDestroy($id)
    {
        $order = Order::findOrFail($id);
        $order->delete();
        return response()->json(['message' => 'Order deleted successfully']);
    }}
