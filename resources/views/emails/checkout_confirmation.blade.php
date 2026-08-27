<!DOCTYPE html>
<html>
<head>
    <title>Order Confirmation</title>
</head>
<body>
    <h2>Thank you for your order!</h2>
    <p>Your order #{{ $order->id }} has been placed successfully.</p>
    <p>You can view your order details here (link valid for 1 hour):</p>
    <p><a href="{{ $signedUrl }}">{{ $signedUrl }}</a></p>
</body>
</html>
