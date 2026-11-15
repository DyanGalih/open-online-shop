<?php

namespace App\Console\Commands;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ReleaseExpiredReservations extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'inventory:release-expired {--hours=1 : Number of hours unconfirmed reservations remain valid}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Release unconfirmed inventory reservations older than specified hours';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $hours = (int) $this->option('hours');
        if ($hours <= 0) {
            $this->error('The --hours option must be a positive integer greater than zero.');

            return Command::FAILURE;
        }

        $cutoff = Carbon::now()->subHours($hours);

        $expiredOrders = Order::where('status', 'pending')
            ->where('created_at', '<=', $cutoff)
            ->with('items')
            ->get();

        if ($expiredOrders->isEmpty()) {
            $this->info('No expired reservations found.');

            return Command::SUCCESS;
        }

        $releasedCount = 0;

        foreach ($expiredOrders as $order) {
            DB::transaction(function () use ($order, &$releasedCount) {
                /** @var Order|null $lockedOrder */
                $lockedOrder = Order::where('id', $order->id)->lockForUpdate()->first();
                if (! $lockedOrder || $lockedOrder->status !== 'pending') {
                    return;
                }

                foreach ($lockedOrder->items as $item) {
                    Product::where('id', $item->product_id)->increment('stock', $item->quantity);
                }

                $lockedOrder->update(['status' => 'cancelled']);
                $releasedCount++;

                Log::info("Released expired reservation for order {$lockedOrder->id}");
            });
        }

        $this->info("Successfully released {$releasedCount} expired order reservation(s).");

        return Command::SUCCESS;
    }
}
