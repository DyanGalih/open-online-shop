<?php

namespace App\Services;

use App\Data\AddressStoreData;
use App\Models\Address;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class CustomerAddressService
{
    /** @return Collection<int, Address> */
    public function getAddressesForUser(User $user): Collection
    {
        return Address::where('user_id', $user->id)->latest()->get();
    }

    public function createAddress(User $user, AddressStoreData $data): Address
    {
        return DB::transaction(function () use ($user, $data) {
            User::where('id', $user->id)->lockForUpdate()->first();

            if ($data->isDefault) {
                Address::where('user_id', $user->id)->update(['is_default' => false]);
            }

            return Address::create([
                'user_id' => $user->id,
                'recipient_name' => $data->recipientName,
                'phone' => $data->phone,
                'street' => $data->street,
                'city' => $data->city,
                'postal_code' => $data->postalCode,
                'is_default' => $data->isDefault,
            ]);
        });
    }

    public function deleteAddress(Address $address): void
    {
        $address->delete();
    }
}
