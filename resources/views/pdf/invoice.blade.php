<!DOCTYPE html>
<html>
<head>
    <title>Invoice {{ $order->id }}</title>
    <style>
        body { font-family: sans-serif; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    </style>
</head>
<body>
    <h1>Invoice</h1>
    <p><strong>Order ID:</strong> {{ $order->id }}</p>
    <p><strong>Date:</strong> {{ $order->created_at->format('Y-m-d') }}</p>
    
    <table>
        <thead>
            <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
            </tr>
        </thead>
        <tbody>
            @foreach($order->items as $item)
            <tr>
                <td>{{ $item->product_name }}</td>
                <td>${{ $item->price }}</td>
                <td>{{ $item->quantity }}</td>
                <td>${{ $item->price * $item->quantity }}</td>
            </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr>
                <td colspan="3" style="text-align: right; font-weight: bold;">Total:</td>
                <td>${{ $order->total_amount }}</td>
            </tr>
        </tfoot>
    </table>
</body>
</html>
