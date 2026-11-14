<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class GrantAdminCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'admin:grant {email : The email address of the user to grant admin privileges}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Grant administrator privileges to an existing user';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $email = (string) $this->argument('email');
        $user = User::where('email', $email)->first();

        if (! $user) {
            $this->error("User with email '{$email}' not found.");

            return self::FAILURE;
        }

        $user->forceFill(['is_admin' => true])->save();
        $this->info("Successfully granted admin privileges to {$user->email}.");

        return self::SUCCESS;
    }
}
