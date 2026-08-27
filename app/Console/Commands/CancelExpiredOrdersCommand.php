<?php

namespace App\Console\Commands;

use App\Models\Order;
use Illuminate\Console\Command;

class CancelExpiredOrdersCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'orders:cancel-expired';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cancel pending orders whose 1-hour payment window has expired';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $count = Order::where('status', 'pending')
            ->whereNotNull('payment_due_at')
            ->where('payment_due_at', '<', now())
            ->update(['status' => 'cancelled']);

        $this->info("Cancelled {$count} expired pending orders.");

        return self::SUCCESS;
    }
}
