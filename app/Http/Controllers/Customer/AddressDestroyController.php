<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Services\CustomerAddressService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class AddressDestroyController extends Controller
{
    public function __invoke(Address $address, Request $request, CustomerAddressService $service): RedirectResponse
    {
        Gate::authorize('delete', $address);

        $service->deleteAddress($address);

        return back()->with('success', 'Address deleted.');
    }
}
