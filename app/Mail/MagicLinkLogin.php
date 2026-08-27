<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class MagicLinkLogin extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public User $user,
        public string $loginUrl
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: config('app.name', 'Online Shop').' — Sign in to your account',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.magic_link_login',
        );
    }
}
