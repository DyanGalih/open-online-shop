<!DOCTYPE html>
<html>
<head>
    <title>Sign In Magic Link</title>
</head>
<body>
    <h2>Sign in to your account</h2>
    <p>Click the link below to sign in (link valid for 5 minutes):</p>
    <p><a href="{{ $loginUrl }}">{{ $loginUrl }}</a></p>
    <p>If you did not request this link, no action is needed.</p>
</body>
</html>
