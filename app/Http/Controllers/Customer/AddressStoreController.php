<?php

namespace App\Http\Controllers\Customer;

use App\Data\AddressStoreData;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\CustomerAddressService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class AddressStoreController extends Controller
{
    public function __invoke(AddressStoreData $data, Request $request, CustomerAddressService $service): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();
        $service->createAddress($user, $data);

        return back()->with('success', 'Address added.');
    }
}
