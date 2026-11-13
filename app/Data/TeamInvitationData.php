<?php

namespace App\Data;

use App\Enums\TeamRole;
use App\Models\Team;
use App\Rules\UniqueTeamInvitation;
use Illuminate\Validation\Rule;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\CamelCaseMapper;

#[MapInputName(CamelCaseMapper::class)]
class TeamInvitationData extends Data
{
    public function __construct(
        public string $email,
        public string $role,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public static function rules(): array
    {
        $team = request()->route('team');

        $emailRules = ['required', 'string', 'email', 'max:255'];

        if ($team instanceof Team) {
            $emailRules[] = new UniqueTeamInvitation($team);
        }

        return [
            'email' => $emailRules,
            'role' => ['required', 'string', Rule::enum(TeamRole::class)->except([TeamRole::Owner])],
        ];
    }
}
