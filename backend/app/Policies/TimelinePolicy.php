<?php

namespace App\Policies;

use App\Models\User;

class TimelinePolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
        //
    }

    public function update(User $user, Timeline $timeline)
    {
        return $user->id === $timeline->user_id;
    }

    public function delete(User $user, Timeline $timeline)
    {
        return $user->id === $timeline->user_id;
    }

}
