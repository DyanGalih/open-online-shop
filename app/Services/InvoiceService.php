<?php

namespace App\Services;

use App\Mail\OrderInvoice;
use App\Models\Order;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Mail;

class InvoiceService
{
    public function generateAndSend(Order $order): void
    {
        $pdf = Pdf::loadView('pdf.invoice', ['order' => $order]);

        Mail::to($order->user->email)->send(new OrderInvoice($order, $pdf->output()));
    }
}
