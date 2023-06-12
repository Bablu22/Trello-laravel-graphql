<?php

namespace App\GraphQL\Mutations;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Arr;

final class Logout
{
    /**
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        $guard = Auth::guard(Arr::first(config('sanctum.guard', 'web')));
        $user = $guard->user();
        $guard->logout();
        return $user;
    }
}