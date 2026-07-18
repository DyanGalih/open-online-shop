<div>
    <h1>Welcome to Online Shop!</h1>
    <p>Hi {{ $user->name }},</p>
    <p>We have created an account for you so you can access your digital downloads and track your order history.</p>
    <p>Here are your temporary login details:</p>
    <ul>
        <li><strong>Email:</strong> {{ $user->email }}</li>
        <li><strong>Password:</strong> {{ $password }}</li>
    </ul>
    <p>Please log in and change your password as soon as possible.</p>
    <br>
    <a href="{{ route('login') }}">Login Here</a>
</div>
